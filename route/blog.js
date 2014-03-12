/**
 * /routes/blog.js
 */

var moment = require('moment');
var data2xml = require('data2xml');

var blogConfig = require('../config').blogConfig;
var rssConfig = require('../config').rssConfig;
var akismetConfig = require('../config').akismetConfig;

var Post = require('../models/post');
var Comment = require('../models/comment');
var Page = require('../models/page');
// var Link = require('../models/link');

var util = require('../libs/util');

// setting akismet client
var akismet = require('akismet').client({
  blog: akismetConfig.blog,
  apiKey: akismetConfig.apiKey
});

/**
 * homepage
 */
exports.index = function(req, res, exceptionHandler) {
  Post.count(null, function(err, count) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    if (0 === count) {
      // 初始化数据
      res.redirect("/admin/install");
    }

    // 分页
    var listRows = parseInt(blogConfig.listRows);
    var maxPage = parseInt(count / listRows) + ((count % listRows) ? 1 : 0);
    // get /p/(+d) 当前页
    var currentPage = 1;

    if (req.params[0]) {
      currentPage = parseInt(req.params[0]);
    }
    currentPage = currentPage < 1 ? 1 : currentPage;

    if (maxPage < currentPage) {
      currentPage = maxPage;
    }

    // 数据起始位置
    var start = (currentPage - 1) * listRows;
    var fields = 'title slug content created';
    Post.findAll(start, listRows, fields, function(err, posts) {
      if (err) {
        return exceptionHandler().handleError(err, req, res);
      }

      // 上一页 下一页
      var previousPage = 0;
      var nextPage = 0;
      if (1 === currentPage && count > listRows) {
        nextPage = currentPage + 1;
      } else if (maxPage === currentPage) {
        previousPage = currentPage - 1;
      } else {
        previousPage = currentPage - 1;
        nextPage = currentPage + 1;
      }

      var data = {
        title: blogConfig.blogname,
        blogname: blogConfig.blogname,
        posts: posts,
        maxPage: maxPage,
        currentPage: currentPage,
        previousPage: previousPage,
        nextPage: nextPage
      }

      res.render('blog/index', data);
    });
  });
};

/**
 * post
 */
exports.post = function(req, res, exceptionHandler) {
  Post.findBySlug(req.params.slug, null, function(err, post) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    if (null === post) {
      return exceptionHandler().handleNotFound(req, res);
    }

    // 生成token
    var token = util.generateToken();
    req.session.token = token;
    var data = {
      title: blogConfig.blogname + ' | ' + post.title,
      blogname: blogConfig.blogname,
      post: post,
      token: token
    }

    res.render('blog/post', data);    
  });
};

/**
 * submit a comment
 */
exports.comment = function(req, res, exceptionHandler) {
  var id = req.body.id;
  var slug = req.body.slug;
  var referer = req.headers['referer'];

  // 防自动提交
  if (!id
      || !slug
      || !req.body.token
      || req.body.token !== req.session.token
      || !referer
      || referer.indexOf(slug) <= 0) {
    return exceptionHandler().handleNotFound(req, res);
  }

  // 销毁token
  req.session.token = null;

  var comment = new Comment({ author: req.body.author,
                              email: req.body.email,
                              website: req.body.website,
                              content: req.body.content,
                              authorIp: req.ip });
  // 验证数据是否正确
  comment.validate(function(err) {
    if (err) {
      // 取出验证错误的信息
      var messages = [];
      for (var error in err.errors) {
        messages.push(err.errors[error].message);
      }

      var data = {
        messages: messages,
        back: '/post/' + slug
      };

      return res.render('blog/public/error', data);
    }

    // 是否配置了akismet
    if ('' !== akismetConfig.blog && '' !== akismetConfig.apiKey) {
      akismet.checkSpam({
        user_ip: comment.authorIp,
        permalink: akismetConfig.blog + '/post/' + slug,
        comment_author: comment.author,
        comment_content: comment.content,
        comment_author_email: comment.email,
        comment_author_url: comment.website,
        comment_type: "comment"
      }, function(err, spam) {
        if (spam) {
          // 标记为垃圾评论
          comment.isSpam = true;
        }
      });
    }

    // 添加一个评论到post
    Post.addCommentById(id ,comment, function(err,numberAffected, raw) {
      if (err) {
        return exceptionHandler().handleError(err, req, res);
      }

      res.redirect('/post/' + slug);
    });
  });
};

/**
 * tag
 */
exports.tag = function(req, res, exceptionHandler) {
  Post.findByTag(req.params.tag, 'title slug created', function(err, posts) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var data = {
      title: blogConfig.blogname + ' | ' + req.params.tag,
      blogname: blogConfig.blogname,
      posts: posts,
      tag: req.params.tag
    }

    res.render('blog/tag', data);
  });
};

/**
 * archives
 */
exports.archives = function(req, res, exceptionHandler) {
  Post.findAll(null, null, null, function(err, posts) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    if (0 === posts.length) {
      res.redirect('/admin/install');
    }

    var archivesList = [];
    posts.forEach(function(post, i) {
      var year = moment(post.created).format('YYYY');
      if ('undefined' === typeof archivesList[year]) {
        archivesList[year] = { year: year, archives: [] };
      }

      archivesList[year].archives.push(post);
    });

    // sort by year desc 
    var compare = function(a, b) {
      return a.year < b.year;
    }
    archivesList = archivesList.sort(compare);

    var data = {
      title: blogConfig.blogname + ' | ' + '文章存档',
      blogname: blogConfig.blogname,
      archivesList: archivesList
    };

    res.render('blog/archives', data);
  });
};

/**
 * links
 */
exports.links = function(req, res, exceptionHandler) {
  renderPage('links', req, res, exceptionHandler);

  // Link.findAll('name url description', function(err, links) {
  //   if (err) {
  //     return exceptionHandler().handleError(err, req, res);
  //   }

  //   var data = {
  //     title: blogConfig.blogname + ' | ' + '友情链接',
  //     blogname: blogConfig.blogname,
  //     links: links
  //   }

  //   res.render('blog/links', data);
  // });
};

/**
 * about
 */
exports.about = function(req, res, exceptionHandler) {
  renderPage('about', req, res, exceptionHandler);
};

/**
 * feed
 */
exports.feed = function(req, res, exceptionHandler) {
  if ('undefined' === typeof rssConfig) {
    return exceptionHandler().handleNotFound(req, res);
  }

  Post.findAll(0, parseInt(rssConfig.rssRows), null, function(err, posts) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var rssObject = {
      _attr: { version: '2.0' },
      channel: {
        title: rssConfig.title,
        description: rssConfig.description,
        link: rssConfig.link,
        language: rssConfig.language,
        managingEditor: rssConfig.language,
        webMaster: rssConfig.webMaster,
        generator: rssConfig.generator,
        items: []
      }
    };

    // 添加post到rss列表中
    posts.forEach(function(post) {
      rssObject.channel.items.push({
        title: post.title,
        author: {
          name: rssConfig.author.name
        },
        link: rssConfig.link + '/post/' + post.slug,
        guid: rssConfig.link + '/post/' + post.slug,
        pubDate: moment(post.created).format('YYYY-MM-DD'),
        lastBuildDate: moment(post.updated).format('YYYY-MM-DD'),
        description: post.content
      });
    });

    // 转成xml格式
    var rssContent = data2xml({})('rss', rssObject);
    // xml
    res.contentType('application/xml');
    res.send(rssContent);
  });
}

/**
 * 渲染page数据的页面
 * @param  string slug
 * @param  Require req
 * @param  Response res
 * @param  Function exceptionHandler
 * @return
 */
var renderPage = function(slug, req, res, exceptionHandler) {
  Page.findBySlug(slug, null, function(err, page) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    if (null === page) {
      return exceptionHandler().handleNotFound(req, res);
    }

    var data = {
      title: blogConfig.blogname + ' | ' + page.title,
      blogname: blogConfig.blogname,
      page: page
    }

    res.render('blog/page', data);
  });
}
