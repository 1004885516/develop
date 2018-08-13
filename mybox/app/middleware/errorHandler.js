'use strict';

module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // token异常
      if (err.name === 'JsonWebTokenError') {
        if (err.message === 'jwt expired') {
          err.message = 'jwt_expired';
        } else {
          err.message = 'auth_failed_user';
        }
      } else if (err.name === 'MongoError') {
        const message = err.message;
        if (message.indexOf('title_1') !== -1) {
          err.message = '标题重复，请重新输入';
        } else if (message.indexOf('phone') !== -1) {
          err.message = '手机号码重复，请重新输入';
        } else {
          err.message = '数据库错误';
        }
      }

      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        status: 'error',
        code: 100,
        url: ctx.url,
        error,
      };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = 200;
    }
  };
};
