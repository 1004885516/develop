'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1533095719612_8419';

  config.middleware = [ 'errorHandler' ];

  // 跨域问题解决        egg-cors模块
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    // credentials: true,
  };
  // post   请求必须配置
  config.security = {
    csrf: {
      enable: false,
      // ignoreJSON: true,
      // useSession: true,
      // headerName: '_csrf', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
    },
    // domainWhiteList: ['http://192.168.3.104:8100'],
  };
  config.verify_codes_resend = 20 * 1000; // 验证码重发时间
  config.verify_codes = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
  config.token_key = 'asdrdcvtuhjerwsd13sd65rfg331235fgSDsd';
  config.mongoose = {
    // url: 'mongodb://47.92.118.197:27017/epidemic',
    url: 'mongodb://127.0.0.1:27017/epidemic',
    options: {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  };
  config.page = {
    entry_per_page: 10,
    entry_page: 5,
  };
  // add your config here
  config.middleware = [];
  config.cluster = {
    listen: {
      hostname: '0.0.0.0',
      port: 7001,
    },
  };
  config.assets = {
    publicPath: '/public/',
  };
  return config;
};
