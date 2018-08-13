'use strict';

// (options, app)文档里支持第二个是app的，不过实际app是undefined，只能通过ctx.app取
// const decoded = jwt.verify(token, ctx.app.config.secret_keys.user);报错直接errorHandler捕获，意味着所有报错都统一走那里，处理的话也要去那处理

const jwt = require('jsonwebtoken');
module.exports = () => {
  return async function(ctx, next) {
    const token = ctx.request.body['x-access-token'] || ctx.request.headers['x-access-token'];
    if (token) {
      const decoded = jwt.verify(token, ctx.app.config.token_key);
      console.log('decoded',decoded)
      const user = await ctx.model.User.findOne({ _id: decoded.id });
      if (!user) {
        ctx.throw(404, '用户未找到');
      }
      // if (user.role === ctx.app.config.user_roles.CPPCC_SUPER_ADMIN) {
      //   ctx.decoded = decoded;
      // } else if (user.role !== decoded.role) {
      //   const a = 'token_change:' + user.role.toString();
      //   ctx.throw(404, a);
      // } else {
      //   ctx.decoded = decoded;
      // }
      ctx.decoded = decoded;
      ctx.user = user;
      await next();
    } else {
      ctx.throw(404, 'err: no_token\nurl: ' + ctx.request.url);
    }
  };
};
