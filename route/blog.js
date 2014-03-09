/**
 * /routes/blog.js
 */

var config = require('../config').config;
var Post = require('../models/post');

// 首页
exports.index = function(req, res, exceptionHandler) {
  Post.count(null, function(err, count) {
    if (err) {
      exceptionHandler.handleError(err, req, res);
    }

    if (0 === count) {
      // 初始化数据
      res.redirect("/admin/install");
    }

    // 分页
    var listRows = config.listRows;
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
        exceptionHandler().handleError(err, req, res);
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
        title: config.blogname,
        blogname: config.blogname,
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
      exceptionHandler.handleError(err, req, res);
    }
    
    if (0 === posts.length) {
      exceptionHandler.handleNotFound(req, res);
    }

    var post = posts[0];
    var data = {
      title: config.blogname + ' | ' + post.title,
      blogname: config.blogname,
      post: post
    }

    res.render('blog/post', data);    
  });
};

// 标签页
exports.tag = function(req, res, next) {
  var data = {
    title: config.blogname,
    blogname: config.blogname
  }

  res.render('blog/tag', data);
};

// 归档页
exports.archives = function(req, res, next) {
  var data = {
    title: config.blogname,
    blogname: config.blogname
  }

  res.render('blog/archives', data);
};

// 友情链接
exports.links = function(req, res, next) {
  var data = {
    title: config.blogname,
    blogname: config.blogname
  }

  res.render('blog/links', data);
};

// 关于我
exports.about = function(req, res, next) {
  var data = {
    title: config.blogname,
    blogname: config.blogname
  }

  res.render('blog/about', data);
};
