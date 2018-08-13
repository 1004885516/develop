'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const verifyUser = app.middleware.verifyUser();
  router.post('/getList', controller.detail.getContent);
  router.post('/add', controller.detail.addNew);
  router.post('/addUser', controller.user.addUser);
  router.post('/getUser', controller.user.getUser);
  router.post('/login', controller.user.login);
  router.post('/getToken', controller.user.getToken);
  router.post('/addVerifyCode',controller.user.addVerifyCode);
};
