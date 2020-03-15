/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';
const Service = require('egg').Service;
// const _ = require('underscore');

class user extends Service {
  async getOne(data) {
    return await this.ctx.model.User
      .findOne(data)
      .select(data.select || {})
      .exec();
  }
  async getList(data) {
    return await this.ctx.model.User
        .find(data)
        .select(data.select || {})
        .exec();
  }
  async setPwd(query, option) {
    return await this.ctx.model.User
        .update(query,option || {multi: true})
        .exec();
  }
  async add(data) {
    return await this.ctx.model.User.create(data);
  }
}


module.exports = user;
