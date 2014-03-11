/**
 * /config/admin_config.js
 */

// admin config
var config = {
  // 页面标题
  pageTitle: 'Fun with Node.js',
  // 添加管理员的token，''则表示不使用
  token: '924271b7fb0b0a997c1464b0b163dda066ee78a6',
  // auth key
  authKey: 'mysecretkey',
  // 最大登陆数
  maxAttempts: 5,
  // locked时间，单位毫秒
  lockedExpire: 7200000
};

module.exports = config;
