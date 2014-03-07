/**
 * /routes/blog.js
 */

var config = require('../config').config;

// 首页
exports.index = function(req, res, next) {
  var data = {
    blog_name: config.blog_name
  }

  res.render('blog/index', data);
};

// 文章页
exports.post = function(req, res, next) {
  res.render('blog/post');
};

// 标签页
exports.tag = function(req, res, next) {
  res.render('blog/tag');
};

// 归档页
exports.archives = function(req, res, next) {
  res.render('blog/archives');
};

// 友情链接
exports.links = function(req, res, next) {
  res.render('blog/links');
};

// 关于我
exports.about = function(req, res, next) {
  res.render('blog/about');
};
