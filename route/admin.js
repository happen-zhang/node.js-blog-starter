/**
 * /routes/admin.js
 */

var adminConfig = require('../config').adminConfig;

var Admin = require('../models/admin');

exports.login = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/login', data);
};

exports.home = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/home', data);
};

exports.pageIndex = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/index', data);
};

exports.pageEdit = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/edit', data);
};

exports.pageWrite = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/write', data);
};

exports.postIndex = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/index', data);
};

exports.postEdit = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/edit', data);
};

exports.postWrite = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/write', data);
};

exports.commentIndex = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/comment/index', data);
};

exports.verifyAkismet  = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/verifyAkismet', data);
};

exports.install = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/install', data);
};

exports.add = function(req, res, exceptionHandler) {
  if ('' === adminConfig.token
      || !req.params.token
      || req.params.token !== adminConfig.token) {
    return exceptionHandler().handleNotFound(req, res);
  }

  var data = {
    title: adminConfig.pageTitle,
    token: req.params.token
  };

  res.render('admin/add', data);
}

exports.create = function(req, res, exceptionHandler) {
  var token = req.body.token;

  if (token !== adminConfig.token
      || !req.headers['referer']) {
    return exceptionHandler().handleNotFound(req, res);
  }

  var admin = new Admin({ loginname: req.body.loginname,
                          password: req.body.password });

  admin.validate(function(err) {
    if (err) {
      // admin invalidate
      var messages = [];
      for (var error in err.errors) {
        messages.push(err.errors[error].message);
      }

      var data = { messages: messages };
      return renderError(res, '/admin/add/' + token, data);
    }

    // save admin
    admin.save(function(err) {
      if (err) {
        return exceptionHandler().handleError(err, req, res);
      }

      res.redirect('/admin');
    });
  });
}

/**
 * 数据错误页
 * @param  Response res
 * @param  string back 返回页面
 * @param  Object data 错误数据
 * @return
 */
var renderError = function(res, back, data) {
  data.messages = data.messages || '数据错误';
  data.back = back || '/';

  return res.render('admin/public/error', data);
}
