'use strict';
const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
//处理node request请求
const request = require('request');
const fs = require('fs');
/* formidable用于解析表单数据，特别是文件上传 */
const formidable = require('formidable');
const path = require('path');

const pump= require('mz-modules/pump');

class user extends Controller{
  // 管理员录入
  async addAdmin(){
    const {ctx} = this
    const user = await ctx.service.user.getOne({username:ctx.request.body.username})
    if(user !== null){
      return ctx.helper.returnerr({ctx, msg:'该用户已注册'});
    }
    const obj = {
      username: ctx.request.body.username,
      pwd : '123456',
      estate_id: ctx.request.body.estate_id
    };
    const result = await ctx.service.user.add(obj);
    ctx.helper.success({ ctx, res: result });
  }

  // 修改管理员密码
  async setPwd(){
    const {ctx} = this
    const user = await ctx.service.user.getOne({username:ctx.request.body.username})
    if(!user){
      return ctx.helper.returnerr({ctx, msg:'该用户未注册'});
    }
    const result = await ctx.service.user.setPwd({username: ctx.request.body.username},{$set:{pwd:ctx.request.body.pwd}});
    ctx.helper.success({ ctx, res: result });
  }
  // 小区录入
  async addEstate(){
    const {ctx} = this
    if(!ctx.request.body.estate[0]){
      return ctx.helper.returnerr({ctx, msg:'参数为空'});
    }
    const result = await ctx.service.estate.add(ctx.request.body.estate);
    ctx.helper.success({ ctx, res: result });
  }
  // 获取全量小区
  async getAllEstate(){
    const {ctx} = this
    const result = await ctx.service.estate.getList({});
    ctx.helper.success({ ctx, res: result });
  }
  // 录入居民信息
  async addResidentr(){
    const {ctx} = this;
    const body = ctx.request.body.data;
    const user = await ctx.service.resident.getOne({phone:body.phone});
    if(user !== null){
      return ctx.helper.returnerr({ctx, msg:'该用户已注册'});
    }
    body['outtime'] = new Date();     // 出行时间
    body['times'] = 0;                // 出行次数
    const result = await ctx.service.resident.add(body);
    ctx.helper.success({ ctx, res: result });
  }
  // 用过code获取微信openIde
  async wxgetOpenId(){
    const {ctx} = this
    if(!ctx.request.body.js_code){
      return ctx.helper.returnerr({ctx, msg:'js_code是必须的'});
    }
    const jscode = ctx.request.body.js_code;
    const data=req.body
    const APP_URL='auth.code2Session';
    const APP_ID='wxXXXXXXXXX'   //小程序的app id ，在公众开发者后台可以看到
    const APP_SECRET='8ad6f0XXXXXXXXXXXX'  //程序的app secrect，在公众开发者后台可以看到
    request(`${APP_URL}?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${data.js_code}&grant_type=authorization_code`, (error, response, body)=>{
      console.log('statusCode:', response && response.statusCode)
      console.log(body);
      res.end(body)});
    const result = await ctx.service.user.add(obj);
    ctx.helper.success({ ctx, res: result });
  }
  // 上传凭证图片
  async uploadMsg(){
    const {ctx} = this
    let parts = this.ctx.multipart({ autoFields: true });
    let stream, img_list = []; // 图片访问地址集合
    while ((stream = await parts()) != null) {
        if (!stream.filename) {
            break;
        }
        // 文件名为：上传图片的名字
        let filename = stream.filename.split('.')[0] + path.extname(stream.filename).toLocaleLowerCase();
        // 上传图片的目录
        let target = 'app/public/certificate/' + filename;
        img_list.push('/public/certificate/' + filename);
        let writeStream = fs.createWriteStream(target);
        await pump(stream, writeStream);
    }
    ctx.helper.success({ ctx, res:{url: img_list} });
  }
  // 查询居民列表
  async getResidents(){
    const {ctx} = this;
    const addressId = ctx.request.body.addressId;
    const result = await ctx.service.resident.getList({"address._id": addressId});
    ctx.helper.success({ ctx, res: result });
  }
  // 登录接口
  async login(){
    const {ctx, app} = this;
    // 验证参数
    const createRule = {
      username: {type: 'string', required: true},
      pwd:{type:'string', required:true}
    };
    // 校验参数
    ctx.validate(createRule);
    const user = await ctx.service.user.getOne({username:ctx.request.body.username})
    if(!user){
      return ctx.helper.returnerr({ctx, msg:'该用户未注册'});
    }
    if(ctx.request.body.pwd !== user.pwd ){
      return ctx.helper.returnerr({ctx, msg:'密码错误'});
    }
    const token = jwt.sign(ctx.request.body, app.config.token_key);
    let result = {token:token}
    if( ctx.request.body.username === 'SuperAdmin'){
      result['type'] = 1
    }
    ctx.helper.success({ ctx, res: result});
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
  async getUserOne(){
    const {ctx} = this
    if(!ctx.request.body.phone){
      ctx.throw(404, '参数错误');
    }

    const user = await ctx.service.user.getOne({phone:ctx.request.body.phone})
    if(!user){
      ctx.throw(404, '用户未找到');
    }
    ctx.helper.success({ ctx, res: user });
  }
  async getUserList(){
    const {ctx} = this
    if(!ctx.request.body.address){
      ctx.throw(404, '参数错误');
    }
    const user = await ctx.service.user.getList({address:ctx.request.body.address})
    if(!user){
      ctx.throw(404, '用户未找到');
    }
    ctx.helper.success({ ctx, res: user });
  }


}
module.exports = user;
