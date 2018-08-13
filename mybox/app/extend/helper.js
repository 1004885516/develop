'use strict';
// 处理成功响应
exports.success = ({ ctx, res = {}, status = 'success' }) => {
  ctx.body = {
    code: 0,
    data: res,
    status,
  };
  ctx.status = 200;
  if (ctx.app.config.env !== 'prod') {
    console.log('============================token===============================');
    console.log(ctx.decoded);
    console.log('============================request=============================');
    console.log(ctx.request.url, ctx.request.body);
    console.log('============================response============================');
    console.log(ctx.body);
  }
};

exports.clone = data => {
  return JSON.parse(JSON.stringify(data));
};

exports.toObject = (arr, key) => {
  const obj = {};
  for (const data of arr) {
    obj[data[key]] = data.toObject();
  }
  return obj;
};
