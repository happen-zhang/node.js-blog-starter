/**
 * /route.js
 */

var blog = require('./route/blog');
var admin = require('./route/admin');

module.exports = function(app) {
  app.get('/', blog.index);
  app.get('/post', blog.post);
  app.get('/tag', blog.tag);
  app.get('/archives', blog.archives);
  app.get('/links', blog.links);
  app.get('/about', blog.about);

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
