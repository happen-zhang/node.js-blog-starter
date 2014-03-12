/**
 * /test/factories.js
 */

var Factory = require('factory-lady');

var Admin = require('../models/admin');

Factory.define('admin', Admin, {
  loginname: 'loginname',
  password: 'password'
});

module.exports = Factory;
