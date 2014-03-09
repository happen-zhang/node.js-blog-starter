/**
 * mocha initilize file
 */

var mongoose = require('mongoose');
var util = require('../libs/util');

// test env
process.env.NODE_ENV = 'test';

var chai = require('chai');

// connect mongodb
var dbConfig = {
  host: 'localhost',
  port: 27017,
  name: 'blog_test',
  username: '',
  password: ''
};
mongoose.connect(util.generateMongoUrl(dbConfig));

global.should = chai.should();
