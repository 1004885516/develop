/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';
const Service = require('egg').Service;
// const _ = require('underscore');

class verifyCode extends Service {
  async getOne(data) {
    return await this.ctx.model.verifyCode
      .findOne(data.find)
      .select(data.select || {})
      .exec();
  }

  async add(data) {
    return await this.ctx.model.User.create(data);
  }

  async getVerifyCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * this.config.verify_codes.length);
      code += this.config.verify_codes[index];
    }
    return code;
  }
}


module.exports = verifyCode;
