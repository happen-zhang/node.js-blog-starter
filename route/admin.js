/**
 * /routes/admin.js
 */

var adminConfig = require('../config').adminConfig;

var Admin = require('../models/admin');
var Post = require('../models/post');

var util = require('../libs/util');

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

/**
 * posts列表
 */
exports.postIndex = function(req, res, next) {
  Post.findAll(null, null, 'title slug', function(err, posts) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var data = {
      title: adminConfig.pageTitle,
      posts: posts
    }

    res.render('admin/post/index', data);    
  });
};

/**
 * write post
 */
exports.postWrite = function(req, res) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/post/write', data);
};

/**
 * add post
 */
exports.postCreate = function(req, res, exceptionHandler) {
  var tags = req.body.tags.split(',');
  var created = new Date();
  if (req.body.created) {
    created = new Date(req.body.created);
  }

  // tags
  tags.forEach(function(tag, i) {
    tags[i] = { name: tag };
  });

  var post = new Post({ title: req.body.title,
                        slug: req.body.slug,
                        tags: tags,
                        content: req.body.content,
                        created: created });

  post.save(function(err) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    res.redirect('/admin/posts');
  });
}

/**
 * edit post
 */
exports.postEdit = function(req, res, exceptionHandler) {
  if (!req.params.slug) {
    return exceptionHandler().handleNotFound(req, res);
  }

  Post.findBySlug(req.params.slug, null, function(err, post) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    // tags
    var tags = '';
    post.tags.forEach(function(tag) {
      tags += tag.name + ',';
    });
    tags = tags.substr(0, tags.length - 1);

    var data = {
      title: adminConfig.pageTitle,
      post: post,
      tags: tags
    }

    res.render('admin/post/edit', data);
  });
};

/**
 * update post
 */
exports.postUpdate = function(req, res, exceptionHandler) {
  if (!req.body.id) {
    return exceptionHandler().handleNotFound(req, res);
  }

  // tags
  var tags = req.body.tags.split(',');
  tags.forEach(function(tag, i) {
    tags[i] = { name: tag };
  });

  var post = { title: req.body.title,
               slug: req.body.slug,
               tags: tags,
               content: req.body.content };
  if (req.body.created) {
    post.created = req.body.created;
  }
  
  Post.updateById(req.body.id, post, function(err) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    res.redirect('/admin/posts');
  });
}

/**
 * 评论列表
 */
exports.commentIndex = function(req, res, exceptionHandler) {
  Post.findAll(null, '_id title slug comments', function(err, posts) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    // isSpam 0 1
    if (req.query['isSpam']) {
      var isSpam = req.query['isSpam'];
    }

    var data = {
      title: adminConfig.pageTitle,
      posts: posts,
      isSpam: isSpam
    }

    res.render('admin/comment/index', data);
  });
};

/**
 * 删除评论
 */
exports.commentDelete = function(req, res, exceptionHandler) {
  if (!req.params.postId || !req.params.id) {
    return exceptionHandler().handleNotFound(req, res);
  }

  Post.deleteCommentById(req.params.postId, req.params.id, function(err) {
    if (err) {
      console.log(err);
      return exceptionHandler().handleError(err, req, res);
    }

    res.redirect('/admin/comments');
  });
};

/**
 * 标记spam
 */
exports.commentSpam = function(req, res, exceptionHandler) {
  if (!req.params.id) {
    return exceptionHandler().handleNotFound(req, res);
  }

  var spam = true;
  if ('true' === req.query['spamStatus']) {
    console.log('sssss');
    spam = false;
  }

  Post.spamCommentById(req.params.id, spam, function(err) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    res.redirect('/admin/comments');
  });
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

/**
 * 登陆页
 */
exports.login = function(req, res, next) {
  // 已登录则重定向到home
  if (hasLogin(req)) {
    return res.redirect('/admin/home');
  }

  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/login', data);
};

/**
 * 处理登录
 */
exports.doLogin = function(req, res, exceptionHandler) {
  var loginname = req.body.loginname.trim();
  var password = req.body.password.trim();
  var admin = new Admin({ loginname: loginname,
                          password: password });

  admin.validate(function(err) {
    if (err) {
      var messages = [];
      for (var error in err.errors) {
        messages.push(err.errors[error].message);
      }

      var data = { messages: messages };
      return renderError(res, '/admin', data);
    }

    // 验证登陆
    Admin.getAuthenticated(loginname, password, function(err, admin, reason) {
      if (err) {
        return exceptionHandler().handleError(err, req, res);
      }

      if (null !== admin) {
        // login ok
        generateSession(req, admin);
        res.redirect('/admin/home');
      }

      var reasons = Admin.failedLogin;
      var data = { messages: [] };
      switch (reason) {
        case reasons.NOT_FOUND:
          data.messages.push('Login Name不存在');
          break;

        case reasons.PASSWORD_INCORRECT:
          data.messages.push('Password错误');
          break;

        case reasons.MAX_LOGIN_ATTEMPTS:
          var hours = adminConfig.lockedExpire / 3600000;
          data.messages.push('登录已被限制，请' + hours + '小时后再尝试登录');
          break;
      }

      return renderError(res, '/admin', data);
    });
  });
};

/**
 * 登出
 */
exports.logout = function(req, res) {
  req.session.destroy();

  res.redirect('/admin');
};

/**
 * 过滤验证登录
 */
exports.authAdmin = function(req, res, next) {
  if (hasLogin(req)) {
    return next();
  }

  res.redirect('/admin');
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
 * 验证是否已登录
 * @return boolean
 */
var hasLogin = function(req) {
  return (req.session.admin
          && req.session.authKey
          && req.session.authKey === generateAuthKey(req.session.admin));
};

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

/**
 * 生成session
 * @param  Request req
 * @param  Admin admin
 * @return
 */
var generateSession = function(req, admin) {
  req.session.authKey = generateAuthKey(admin);
  req.session.admin = admin;
}

/**
 * 生成auth key
 * @param  Admin admin
 * @return string
 */
var generateAuthKey = function(admin) {
  return util.md5(admin.loginname
                  + adminConfig.authKey
                  + admin.password);
}
