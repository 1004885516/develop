'use strict';

// had enabled by egg
// exports.static = true;
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
//跨域拦截设置
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
// 验证参数
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
// 视图
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.static = {
  enable: true
};