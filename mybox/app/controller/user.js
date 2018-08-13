'use strict';
const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
class user extends Controller{
  // 添加用户
  async addUser(){
    const {ctx} = this
    const user = await ctx.service.user.getOne({find:{phone:ctx.request.body.phone}})
    if(user !== null){
      ctx.throw(404, '该手机号已注册');
    }
    const obj = await ctx.service.user.add({
      phone : ctx.request.body.phone,
      password:ctx.request.body.password,
      name : ctx.request.body.name,
      age:ctx.request.body.age,
      gender : ctx.request.body.gender,
      location:ctx.request.body.location,
      email:ctx.request.body.email,
    });
    ctx.helper.success({ ctx, res: obj });
  }
  async login(){
    const {ctx} = this;
    // 验证参数
    const createRule = {
      phone: {type: 'string', required: true},
      password:{type:'string', required:true}
    };
    // 校验参数
    ctx.validate(createRule);
    const user = await ctx.service.user.getOne({find:{phone:ctx.request.body.phone}})
    if(!user){
      ctx.throw(404, '该手机号未注册');
    }
    if(ctx.request.body.password !== user.password ){
      ctx.throw(404, '密码错误');
    }
    ctx.helper.success({ ctx, res: 'success' });
  }
  async getToken(){
    const { ctx, app } = this
    if (!ctx.request.body.phone) {
      ctx.throw(404, '必须填写手机号');
    }
    const token = jwt.sign(ctx.request.body.phone,app.config.token_key)
    ctx.helper.success({ ctx, res: token });
  }
  // 添加
  async addVerifyCode (){
    const {ctx,app } = this
    if(!ctx.request.body.phone){
      ctx.throw(404, '参数错误');
    }
    const user = await ctx.service.user.getOne({find:{phone:ctx.request.body.phone}})
    if(!user){
      ctx.throw(404, '该手机号未注册');
    }
    let code = await ctx.model.VerifyCode.findOne({phone:ctx.request.body.phone})
    if(!code){
      code = await ctx.model.VerifyCode.create({
        phone:ctx.request.body.phone,
        code:await ctx.service.code.getVerifyCode()
      })
    }else{
      if(Date.now() - code.createTime.getTime() < app.config.verify_codes_resend){
        ctx.throw(404, '获取验证码太频繁');
      }else{
        code.code = await ctx.service.code.getVerifyCode()
        code.createTime = new Date()
        await code.save()
      }
    }
    ctx.helper.success({ ctx, res: code });
  }
  // 获取用户
  async getUser(){
    const {ctx} = this
    if(!ctx.request.body.phone){
      ctx.throw(404, '参数错误');
    }
    const user = await ctx.service.user.getOne({find:{phone:ctx.request.body.phone}})
    if(!user){
      ctx.throw(404, '用户未找到');
    }
    ctx.helper.success({ ctx, res: user });
  }


}
module.exports = user;
