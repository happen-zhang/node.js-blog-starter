/**
 * /routes/blog.js
 */

var moment = require('moment');

var blogConfig = require('../config').blogConfig;
var Post = require('../models/post');
var Link = require('../models/link');

// 首页
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
    var listRows = blogConfig.listRows;
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
      if (1 === currentPage) {
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

// 文章页
exports.post = function(req, res, exceptionHandler) {
  Post.findBySlug(req.params.slug, null, function(err, posts) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    if (0 === posts.length) {
      return exceptionHandler().handleNotFound(req, res);
    }

    var post = posts[0];
    var data = {
      title: blogConfig.blogname + ' | ' + post.title,
      blogname: blogConfig.blogname,
      post: post
    }

    res.render('blog/post', data);    
  });
};

// 标签页
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

// 存档页
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

// 友情链接
exports.links = function(req, res, exceptionHandler) {
  Link.findAll('name url description', function(err, links) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var data = {
      title: blogConfig.blogname + ' | ' + '友情链接',
      blogname: blogConfig.blogname,
      links: links
    }

    res.render('blog/links', data);
  });
};

// 关于我
exports.about = function(req, res, next) {
  var data = {
    title: blogConfig.blogname,
    blogname: blogConfig.blogname
  }

  res.render('blog/about', data);
};
