/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';
const Service = require('egg').Service;
// const _ = require('underscore');

class js extends Service {
  async getOne(data) {
    return await this.ctx.model.Javascript
      .findOne(data.find)
      .select(data.select || {})
      .exec();
  }

  async add(data) {
    return await this.ctx.model.Javascript.create(data);
  }
  async edit(data) {
    return await this.ctx.model.Javascript.create(data);
  }
  async del(data) {
    return await this.ctx.model.Javascript.remove(data);
  }
  async getList(data) {
    return await this.ctx.model.Javascript
      .find(data.find)
      .select(data.select || {})
      .sort(data.sort || {})
      .skip(data.skip)
      .limit(data.limit)
      .exec();
  }
}


module.exports = js;
