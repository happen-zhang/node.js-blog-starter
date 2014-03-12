/**
 * /test/model/admin.js
 */

var mongoose = require('mongoose');

var dbConfig = require('../../config/db_config').test;
var adminConfig = require('../../config/admin_config');

var Factory = require('../factories');
var Admin = require('../../models/admin');

describe('Admin Model', function() {
  
  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }

    mongoose.connect(dbConfig.dbUrl, done);
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });

  // test model whether is valid
  describe('model validation', function() {
    it('creates valid with right value', function(done) {
      var validData = { loginname: 'loginname', password: 'password' };
      Factory.build('admin', validData, function(admin) {
        admin.save(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('creates invalid with password=""', function(done) {
      Factory.build('admin', { password: '' }, function(admin) {
        admin.save(function(err) {
          err.errors.password.type.should.equal('required');
          done();
        });
      });
    });

    it('creates invalid with loginname=""', function(done) {
      Factory.build('admin', { loginname: '' }, function(admin) {
        admin.save(function(err) {
          err.errors.loginname.type.should.equal('required');
          done();
        });
      });
    });
  });

  // test comparePassword mehtod
  describe('comparePassword', function() {
    var original = null;
    var originPwd = 'origin';

    before(function(done) {
      Factory.build('admin', { password: originPwd }, function(admin) {
        admin.save(function(err) {
          original = admin;
          done();
        });
      });
    });

    it('compare with incorrect password should be false', function(done) {
      var incorrectPwd = 'incorrect';
      original.comparePassword(incorrectPwd, function(err, isMathch) {
        isMathch.should.equal(false);
        done();
      });
    });

    it('compare with right password should be true', function(done) {
      original.comparePassword(originPwd, function(err, isMathch) {
        isMathch.should.equal(true);
        done();
      });
    });
  });

  // test authenticated to login
  describe('authenticated', function() {
    var loginname = 'loginname';
    var password = 'password';
    var info = {
      loginname: loginname,
      password: password
    };

    before(function(done) {
      Factory.build('admin', info, function(admin) {
        admin.save(function(err) {
          done();
        });
      });
    });

    it('should admins length equals 1', function(done) {
      Admin.find(null, null, null, function(err, admin) {
        admin.length.should.equal(1);
        done();
      });
    });

    // loginname不存在
    it('login with a loginname which not exists', function(done) {
      var name = 'notexist';
      Admin.getAuthenticated(name, password, function(err, admin, reason) {
        should.not.exist(admin);
        reason.should.equals(Admin.failedLogin.NOT_FOUND);
        done();
      });
    });

    it('login with a incorrect password', function(done) {
      var pwd = 'incorrect';
      Admin.getAuthenticated(loginname, pwd, function(err, admin, reason) {
        should.not.exist(admin);
        reason.should.equals(Admin.failedLogin.PASSWORD_INCORRECT);
        done();
      });
    });

    it('should be locked when attempts over MAX_ATTEMPTS');
    
    // it('should be locked when attempts over MAX_ATTEMPTS', function(done) {
    //   before(function(done) {
    //     var conditions = { loginname: loginname };
    //     var updates = { $set: { loginAttempts: adminConfig.maxAttempts,
    //                             lockUntil: Date.now() + 3600000 } };
    //     Admin.update(conditions, updates, function(err) {
    //       done();
    //     });
    //   });

    //   var pwd = 'incorrect';
    //   Admin.getAuthenticated(loginname, pwd, function(err, admin, reason) {
    //     should.not.exist(admin);
    //     reason.should.equals(Admin.failedLogin.MAX_ATTEMPTS);        
    //     done();
    //   });
    // });

    it('should be authenticated ok', function(done) {
      Admin.getAuthenticated(loginname, password, function(err, admin, reason){
        should.not.exist(reason);
        admin.loginname.should.equal(loginname);
        done();
      });
    });
  });
});
