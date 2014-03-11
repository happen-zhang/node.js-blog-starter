/**
 * /routes.js
 */

var blog = require('./route/blog');
var admin = require('./route/admin');

exports.handle = function(app) {
  app.get('/', blog.index, exceptionHandler);
  app.get(/^\/p\/(\d+)$/, blog.index, exceptionHandler);
  app.get('/post/:slug', blog.post, exceptionHandler);
  app.post('/comment', blog.comment, exceptionHandler);
  app.get('/tag/:tag', blog.tag, exceptionHandler);
  app.get('/archives', blog.archives, exceptionHandler);
  app.get('/links', blog.links, exceptionHandler);
  app.get('/about', blog.about, exceptionHandler);
  app.get('/feed', blog.feed, exceptionHandler);

  app.get('/admin', admin.login);
  app.post('/admin', admin.doLogin, exceptionHandler);
  app.get('/admin/logout', admin.authAdmin, admin.logout);
  app.get('/admin/home', admin.authAdmin, admin.home);
  app.get('/admin/install', admin.install);
  app.get('/admin/page', admin.authAdmin, admin.pageIndex);
  app.get('/admin/page/edit', admin.authAdmin, admin.pageEdit);
  app.get('/admin/page/write', admin.authAdmin, admin.pageWrite);
  app.get('/admin/post', admin.authAdmin, admin.postIndex);
  app.get('/admin/post/edit', admin.authAdmin, admin.postEdit);
  app.get('/admin/post/write', admin.authAdmin, admin.postWrite);
  app.get('/admin/comment', admin.authAdmin, admin.commentIndex);
  app.get('/admin/verifyAkismet', admin.authAdmin, admin.verifyAkismet);

  app.get('/admin/add/:token', admin.add, exceptionHandler);
  app.post('/admin/create', admin.create, exceptionHandler);
};

exports.handleNotFound = function(req, res) {
  res.status(404);
  res.render('blog/public/404.html');
};

exports.handleError = function(err, req, res, next) {
  res.status(500);
  res.render('blog/public/500.html');
};

var exceptionHandler = function() {
  return {
    handleNotFound: exports.handleNotFound,
    handleError: exports.handleError
  };
}
