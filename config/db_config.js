/**
 * /config/db_config.js
 */

var mongoose = require('mongoose');

// util
var util = require('../libs/util');

var development = {
  host: 'localhost',
  port: 27017,
  name: 'blog',
  username: '',
  password: ''
};
development.dbUrl = util.generateMongoUrl(development);
exports.development = development;

var test = {
  host: 'localhost',
  port: 27017,
  name: 'blog_test',
  username: '',
  password: '',
};
test.dbUrl = util.generateMongoUrl(test);
exports.test = test;
