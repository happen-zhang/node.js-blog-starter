/**
 * config.js
 */

var mongoose = require('mongoose');

// util
var util = require('./libs/util');
// database configuration
var dbConfig = require('./config/db_config');
// mongodb url
var mongoUrl = util.generateMongoUrl(dbConfig);

// Blog配置
var config = {
  blogName: 'happen',
  port: 3000
};

// connect to mongodb
mongoose.connect(mongoUrl);

exports.config = config;
