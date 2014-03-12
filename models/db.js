/**
 * /models/db.js
 */

var mongoose = require('mongoose');

var dbConfig = require('../config/db_config').development;

mongoose.connect(dbConfig.dbUrl);

// when successfully connected
mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + dbConfig.dbUrl);
});

// if the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
});

// when the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

// if the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected'
    	        + 'through app termination');
    process.exit(0);
  });
});
