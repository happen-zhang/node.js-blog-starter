/**
 * /routes/admin.js
 */

var adminConfig = require('../config').adminConfig;

exports.login = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/login', data);
};

exports.index = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/index', data);
};

exports.pageIndex = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/index', data);
};

exports.pageEdit = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/edit', data);
};

exports.pageWrite = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/write', data);
};

exports.postIndex = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/index', data);
};

exports.postEdit = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/edit', data);
};

exports.postWrite = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/write', data);
};

exports.commentIndex = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/comment/index', data);
};

exports.verifyAkismet  = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/verifyAkismet', data);
};

exports.install = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/install', data);
};
