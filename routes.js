/**
 * /routes.js
 */

var blog = require('./route/blog');
var admin = require('./route/admin');

exports.handle = function(app) {
  /**
   * blog
   */

  // homepage
  app.get('/',
          blog.index,
          exceptionHandler);
  app.get(/^\/p\/(\d+)$/,
          blog.index,
          exceptionHandler);

  // post
  app.get('/post/:slug',
          blog.post,
          exceptionHandler);
  app.post('/comment',
           blog.comment,
           exceptionHandler);

  // tag
  app.get('/tag/:tag',
          blog.tag,
          exceptionHandler);

  // archives
  app.get('/archives',
          blog.archives,
          exceptionHandler);

  // links
  app.get('/links',
          blog.links,
          exceptionHandler);

  // about
  app.get('/about',
          blog.about,
          exceptionHandler);

  // feed
  app.get('/feed',
          blog.feed,
          exceptionHandler);

  /**
   * admin
   */

  // login
  app.get('/admin', admin.login);
  app.post('/admin',
           admin.doLogin,
           exceptionHandler);

  // logout
  app.get('/admin/logout',
          admin.authAdmin,
          admin.logout);

  // home
  app.get('/admin/home',
          admin.authAdmin,
          admin.home);

  // pages
  app.get('/admin/pages',
          admin.authAdmin,
          admin.pageIndex);

  // page write
  app.get('/admin/page/write',
          admin.authAdmin,
          admin.pageWrite);

  // page create
  app.post('/admin/page/create',
           admin.authAdmin,
           admin.pageCreate,
           exceptionHandler);

  // page edit
  app.get('/admin/page/edit/:slug',
          admin.authAdmin,
          admin.pageEdit,
          exceptionHandler);

  // page update
  app.post('/admin/page/update',
           admin.authAdmin,
           admin.pageUpdate,
           exceptionHandler);

  // posts
  app.get('/admin/posts',
          admin.authAdmin,
          admin.postIndex,
          exceptionHandler);

  // post add
  app.get('/admin/post/write',
          admin.authAdmin,
          admin.postWrite);

  // post create
  app.post('/admin/post/create',
           admin.authAdmin,
           admin.postCreate,
           exceptionHandler);

  // post edit
  app.get('/admin/post/edit/:slug',
          admin.authAdmin,
          admin.postEdit,
          exceptionHandler);

  // post update
  app.post('/admin/post/update',
           admin.authAdmin,
           admin.postUpdate,
           exceptionHandler);

  // comments
  app.get('/admin/comments',
          admin.authAdmin,
          admin.commentIndex,
          exceptionHandler);

  // comment delete
  app.get('/admin/comment/delete/:postId/:id',
          admin.authAdmin,
          admin.commentDelete,
          exceptionHandler);

  // comment spam
  app.get('/admin/comment/spam/:id',
          admin.authAdmin,
          admin.commentSpam,
          exceptionHandler);

  // install
  app.get('/admin/install',
          admin.install);

  // do install
  app.post('/admin/doInstall',
           admin.doInstall,
           exceptionHandler);

  // verify akismet
  app.get('/admin/verifyAkismet',
          admin.authAdmin,
          admin.verifyAkismet,
          exceptionHandler);

  // admin add
  app.get('/admin/add/:token',
          admin.add,
          exceptionHandler);

  // admin create
  app.post('/admin/create',
           admin.create,
           exceptionHandler);
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
