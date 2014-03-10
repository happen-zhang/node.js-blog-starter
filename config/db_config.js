/**
 * /config/db_config.js
 */

var mongoose = require('mongoose');

// util
var util = require('../libs/util');

var config = {
  host: 'localhost',
  port: 27017,
  name: 'blog',
  username: '',
  password: ''
}

// mongodb url
var mongoUrl = util.generateMongoUrl(config);

// connect to mongodb
mongoose.connect(mongoUrl);

module.exports = config;
