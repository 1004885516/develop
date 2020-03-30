'use strict';
const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
//处理node request请求
const request = require('request-promise');
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
    // 验证参数
    const createRule = {
      username: {type: 'string', required: true},
      pwd:{type:'string', required:true},
      newpwd:{type:'string', required:true}
    };
    // 校验参数
    ctx.validate(createRule);
    const user = await ctx.service.user.getOne({username:ctx.request.body.username})
    if(!user){
      return ctx.helper.returnerr({ctx, msg:'该用户未注册'});
    }
    if(ctx.request.body.pwd !== user.pwd){
      return ctx.helper.returnerr({ctx, msg:'旧密码错误'});
    }
    const result = await ctx.service.user.setPwd({username: ctx.request.body.username},{$set:{pwd:ctx.request.body.newpwd}});
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
    const {ctx} = thi
    const result = await ctx.service.estate.getList({});
    ctx.helper.success({ ctx, res: result });
  }
  // 录入居民信息
  async addResidentr(){
    const {ctx} = this;
    const body = ctx.request.body.data;
    let result = {};
    // if(!body){
    //   return ctx.helper.returnerr({ctx, msg:'请确认参数'});
    // }
    // const user = await ctx.service.resident.getOne({phone:body.openIde});
    // if(user !== null){
    //   return ctx.helper.returnerr({ctx, msg:'该用户已注册'});
    // }
    // body['outtime'] = new Date();     // 出行时间
    // body['times'] = 1;                // 出行次数
    // const result = await ctx.service.resident.add(body);
    // console.log('req#######', ctx.req)


    const stream = await ctx.getFileStream();
    const fields = stream.fields;
    let filename = stream.filename.split('.')[0] + path.extname(stream.filename).toLocaleLowerCase();
    const suffix = stream.filename.split('.')[1];
    // 上传图片的目录
    let target = 'app/public/photo/' + fields.name + '.' + suffix;
    let writeStream = fs.createWriteStream(target);
    // 当使用标准的source.pipe(dest),   dest 就是 fs.createWriteStream操作
    // 1.如果dest出现了error,source不会被销毁
    // 2.而且你无法提供一个回调当pipe被销毁了
    // pump就是解决上面的两个问题的
    await pump(stream, writeStream);
    ctx.helper.success({ ctx, res: {} });
  };
  // 验证居民是否注册  type 0 未注册 1 未审核 2 已审核
  async verifyUser(){
    const {ctx} = this;
    const body = ctx.request.body;
    let type = '';
    if(!body.openid){
      return ctx.helper.returnerr({ctx, msg:'openid是必须的'});
    }
    const user = await ctx.service.resident.getOne({openid:body.openid});
    if(!user){
      type = '0'
    }else{
      if(user.affirm === 'true'){
        type = '1'
      }else{
        type = '2'
      }
    }
    ctx.helper.success({ ctx, res: {type:type} });
  }
  // 管理员审核
  async affirmUser(){
    const {ctx} = this;
    const body = ctx.request.body;
    // 验证参数
    if(!body.openIdes[0]){
      return ctx.helper.returnerr({ctx, msg:'未勾选'});
    }
    for(const item of body.openIdes){
      let user = await ctx.service.resident.getOne({openid:item});
      if(user === null){
        return ctx.helper.returnerr({ctx, msg: item +'该用户未注册:'});
      }
      if(user.affirm === 'true'){
        return ctx.helper.returnerr({ctx, msg:user.name + '该用户已确认过'});
      }
      await ctx.service.resident.setAffirm({openid:item},{$set:{affirm:'true'}});
    }
    ctx.helper.success({ ctx, res: {result:'确认成功'} });
  }
  // 用过code获取微信openIde
  /*
    这里由于需要获取到request的异步请求结果，所以必须要引入request-promise包
    request太陈旧,无法结合async和await使用
   */
  async wxgetOpenId(){
    const {ctx} = this;
    if(!ctx.request.body.js_code){
      return ctx.helper.returnerr({ctx, msg:'js_code是必须的'});
    }
    const data=ctx.request.body;
    const APP_URL="https://api.weixin.qq.com/sns/jscode2session";
    const APP_ID='wxa9806a9cf5d0cda1';   //小程序的app id ，在公众开发者后台可以看到
    const APP_SECRET='b2115e207fca596b8d043a344554d94c';  //程序的app secrect，在公众开发者后台可以看到
    await request(`${APP_URL}?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${data.js_code}&grant_type=authorization_code`, (error, response, body)=>{
      ctx.body = body;
    });
    ctx.helper.success({ ctx, res: ctx.body });
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
    let result = {
      token:token,
      user:user
    };
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
