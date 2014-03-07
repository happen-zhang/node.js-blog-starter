/**
 * /routes/admin.js
 */

exports.login = function(req, res, next) {
  res.render('admin/login');
};

exports.index = function(req, res, next) {
  res.render('admin/index');
};

exports.pageIndex = function(req, res, next) {
  res.render('admin/page/index');
};

exports.pageEdit = function(req, res, next) {
  res.render('admin/page/edit');
};

exports.pageWrite = function(req, res, next) {
  res.render('admin/page/write');
};

exports.postIndex = function(req, res, next) {
  res.render('admin/post/index');
};

exports.postEdit = function(req, res, next) {
  res.render('admin/post/edit');
};

exports.postWrite = function(req, res, next) {
  res.render('admin/post/write');
};

exports.commentIndex = function(req, res, next) {
  res.render('admin/comment/index');
};

exports.verifyAkismet  = function(req, res, next) {
  res.render('admin/verifyAkismet');
};

exports.install = function(req, res, next) {
  res.render('admin/install');
};
