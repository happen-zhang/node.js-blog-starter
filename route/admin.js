/**
 * /routes/admin.js
 */

var adminConfig = require('../config').adminConfig;
var akismetConfig = require('../config').akismetConfig;

var Admin = require('../models/admin');
var Page = require('../models/page');
var Post = require('../models/post');
var Comment = require('../models/comment');
var Tag = require('../models/tag');

var util = require('../libs/util');

// akismet
var akismet = require('akismet').client({
  blog: akismetConfig.blog,
  apiKey: akismetConfig.apiKey
});

/**
 * home
 */
exports.home = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/home', data);
};

/**
 * page列表页
 */
exports.pageIndex = function(req, res, exceptionHandler) {
  Page.find(null, null, null, function(err, pages) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var data = {
      title: adminConfig.pageTitle,
      pages: pages
    }

    res.render('admin/page/index', data);
  });
};

/**
 * write page
 */
exports.pageWrite = function(req, res, next) {
  var data = {
    title: adminConfig.pageTitle
  }

  res.render('admin/page/write', data);
};

/**
 * add page
 */
exports.pageCreate = function(req, res, exceptionHandler) {
  var created = new Date();
  if (req.body.created) {
    created = new Date(req.body.created);
  }

  var page = new Page({ title: req.body.title,
                        slug: req.body.slug,
                        content: req.body.content,
                        created: created });

  page.save(function(err) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    res.redirect('/admin/pages');
  });
};

/**
 * edit page
 */
exports.pageEdit = function(req, res, exceptionHandler) {
  if (!req.params.slug) {
    return exceptionHandler().handleNotFound(req, res);
  }

  Page.findBySlug(req.params.slug, null, function(err, page) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var data = {
      title: adminConfig.pageTitle,
      page: page
    }

    res.render('admin/page/edit', data);
  });
};

/**
 * page update
 */
exports.pageUpdate = function(req, res, exceptionHandler) {
  if (!req.body.id) {
    return exceptionHandler().handleNotFound(req, res);
  }

  var page = { title: req.body.title,
               slug: req.body.slug,
               content: req.body.content };
  if (req.body.created) {
    page.created = req.body.created;
  }
  
  Page.updateById(req.body.id, page, function(err) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    res.redirect('/admin/pages');
  });
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
 * comments列表
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
 * comment delete
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

/**
 * install
 */
exports.install = function(req, res, exceptionHandler) {
  var data = {
    title: 'node.js starter'
  }

  Admin.find(null, null, null, function(err, admins) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    // 已存在管理员员则说明初始化过了
    if (admins.length > 0) {
      data.installed = true;
    }

    res.render('admin/install', data);
  });
};

/**
 * do install
 */
exports.doInstall = function(req, res, exceptionHandler) {
  var admin = new Admin({ loginname: req.body.loginname,
                          password: req.body.password });

  admin.validate(function(err) {
    if (err) {
      var data = { messages: formatModelErrors(err) };
      return renderError(res, '/admin/install', data);
    }

    // save admin
    admin.save(function(err) {
      if (err) {
        return exceptionHandler().handleError(err, req, res);
      }

      // new comment
      var comment = new Comment({
        author: 'happen-zhang',
        email: 'zhanghaipeng404@gmail.com',
        website: 'http://github.com/happen-zhang',
        content: "```\r\n echo 'Nice to meet you!'\r\n```"
      });

      var tag = new Tag({
        name: 'Node.js'
      });

      // add post
      var post = new Post({
        title: 'Hello World!',
        slug: 'hello-world',
        content: "```\r\n echo 'Hello World'\r\n```",
        comments: [comment],
        tags: [tag]
      });

      // save post
      post.save(function(err) {
        if (err) {
          return exceptionHandler().handleError(err, req, res);
        }

        // save page
        var about = new Page({
          title: '关于我',
          slug: 'about',
          content: "```\r\n echo 'Hello World'\r\n```"
        });

        var links = new Page({
          title: '友情链接',
          slug: 'links',
          content: "*\r\n [Google](https://www.google.com.hk/)"
        });

        about.save(function(err) {
          if (err) {
            return exceptionHandler().handleError(err, req, res);
          }
        });

        links.save(function(err) {
          if (err) {
            return exceptionHandler().handleError(err, req, res);
          }          
        });

        var data = {
          msg: 'success',
          title: adminConfig.title
        };

        res.render('admin/install', data);
      });
    });
  });
}

/**
 * 验证akismet key
 */
exports.verifyAkismet  = function(req, res, exceptionHandler) {
  akismet.verifyKey(function(err, isValidate) {
    if (err) {
      return exceptionHandler().handleError(err, req, res);
    }

    var status = false;
    if (isValidate) {
      status = true;
    }

    var data = {
      title: adminConfig.pageTitle,
      status: status
    }

    res.render('admin/verify_akismet', data);
  });
};

/**
 * login
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
 * do login
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
 * logout
 */
exports.logout = function(req, res) {
  req.session.destroy();

  res.redirect('/admin');
};

/**
 * auth admin
 */
exports.authAdmin = function(req, res, next) {
  if (hasLogin(req)) {
    return next();
  }

  res.redirect('/admin');
};

/**
 * add admin
 */
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

/**
 * save admin to datebase
 */
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
      var data = { messages: formatModelErrors(err) };
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

/**
 * 格式化model error为数据形式
 * @param  Object err
 * @return array
 */
var formatModelErrors = function(err) {
  var messages = [];
  for (var error in err.errors) {
    messages.push(err.errors[error].message);
  }

  return messages;
}
