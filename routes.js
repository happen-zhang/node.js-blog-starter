/**
 * /route.js
 */

var blog = require('./route/blog');

module.exports = function(app) {
  app.get('/', blog.index);
  app.get('/post', blog.post);
  app.get('/tag', blog.tag);
  app.get('/archives', blog.archives);
  app.get('/links', blog.links);
  app.get('/about', blog.about);
};
