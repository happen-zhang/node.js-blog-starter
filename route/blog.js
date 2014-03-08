/**
 * /routes/blog.js
 */

var config = require('../config').config;

// 首页
exports.index = function(req, res, next) {
  var data = {
    blogName: config.blogName
  }

  res.render('blog/index', data);
};

// 文章页
exports.post = function(req, res, next) {
  var data = {
    blogName: config.blogName
  }

  res.render('blog/post', data);
};

// 标签页
exports.tag = function(req, res, next) {
  var data = {
    blogName: config.blogName
  }

  res.render('blog/tag', data);
};

// 归档页
exports.archives = function(req, res, next) {
  var data = {
    blogName: config.blogName
  }

  res.render('blog/archives', data);
};

// 友情链接
exports.links = function(req, res, next) {
  var data = {
    blogName: config.blogName
  }

  res.render('blog/links', data);
};

// 关于我
exports.about = function(req, res, next) {
  var data = {
    blogName: config.blogName
  }

  res.render('blog/about', data);
};
