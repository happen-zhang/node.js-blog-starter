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
  app.get('/admin/home', admin.index);
  app.get('/admin/install', admin.install);
  app.get('/admin/page', admin.pageIndex);
  app.get('/admin/page/edit', admin.pageEdit);
  app.get('/admin/page/write', admin.pageWrite);
  app.get('/admin/post', admin.postIndex);
  app.get('/admin/post/edit', admin.postEdit);
  app.get('/admin/post/write', admin.postWrite);
  app.get('/admin/comment', admin.commentIndex);
  app.get('/admin/verifyAkismet', admin.verifyAkismet);
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
