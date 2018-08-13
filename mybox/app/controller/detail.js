'use strict';
const Controller = require('egg').Controller;
class getJS extends Controller{
  // 添加内容
  async addNew(){
    const {ctx} = this
    const obj = await ctx.service.detail.add({
      type : ctx.request.body.type,
      title : ctx.request.body.title,
      content :ctx.request.body.content
    });
    ctx.helper.success({ ctx, res: obj });
  }
  // 获取内容
  async getContent(){
    const {ctx,app} = this
    if(!ctx.request.body.page){
      ctx.request.body.page = 1;
    }
    const obj = {
      count: 0,
      exist: false,
    };
    const count = await ctx.model.Javascript.countDocuments({ type: ctx.request.body.type });
    if (count) {
      obj.count = count;
    }
    obj.exist = count > ctx.request.body.page * app.config.page.entry_per_page;
    obj.list = await ctx.service.detail.getList({
      find: { type: ctx.request.body.type },
      skip: app.config.page.entry_per_page * (ctx.request.body.page - 1),
      limit: app.config.page.entry_per_page,
      sort: { stick: -1, createTime: -1 },
    });
    console.log('#####################')
    console.log(obj.list)
    ctx.helper.success({ ctx, res: obj });
  }


}
module.exports = getJS;
