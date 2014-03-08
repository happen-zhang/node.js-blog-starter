/**
 * /libs/util.js
 */

exports.generateMongoUrl = function(config) {
  host = (config.host || 'localhost');
  port = (config.port || 27017);
  dbName = (config.name || 'test');

  var target = host + ':' + port + '/' + dbName;
  var user = '';
  if (config.username && config.password) {
    user += config.username + ':' + config.password + '@';
  }

  return 'mongodb://' + user + target;
};
