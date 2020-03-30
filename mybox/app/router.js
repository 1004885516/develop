'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const verifyUser = app.middleware.verifyUser();
  router.post('/getList', controller.detail.getContent);
  router.post('/add', controller.detail.addNew);


  router.get('/', controller.home.index)

  router.post('/addAdmin', controller.user.addAdmin);           // 添加管理员
  router.post('/setPwd', controller.user.setPwd);               // 设置管理员密码
  router.post('/addEstate', controller.user.addEstate);         // 批量录入小区
  router.post('/getAllEstate', controller.user.getAllEstate);   // 获取全量小区
  router.post('/addResidentr', controller.user.addResidentr);   // 录入居民信息
  router.post('/verifyUser', controller.user.verifyUser);       // 录入居民信息
  router.post('/affirmUser', controller.user.affirmUser);       // 录入居民信息
  router.post('/getResidents', controller.user.getResidents);   // 查询居民列表
  router.post('/wxgetOpenId', controller.user.wxgetOpenId);     // 用过code获取微信openId
  router.post('/uploadMsg', controller.user.uploadMsg);         // 上传凭证图片
  router.post('/login', controller.user.login);




  router.post('/addVerifyCode',controller.user.addVerifyCode);
};
