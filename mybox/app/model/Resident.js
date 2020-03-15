'use strict';

/*
  居民信息表
 */

module.exports = app => {
  const mongoose = app.mongoose;

  const residentSchema = new mongoose.Schema({
    photo: {type: String},      // 照片
    name : {type: String},      // 名字
    goal : {type: String},      // 外地出行目的
    address: {},                // 小区信息
    phone : {type: String},     // 电话
    vehicle: {type: String},    // 车牌号
    day14: {type: String},      // 是否14天
    outtime: {type: Date},      // 出行时间
    times: {type: Number},      // 出行次数
    user_card: {type: String, required: true, unique : true}, // 身份证
    door_code: {type: String, required: true, unique : true}, // 门牌号
    uuid: {type: String, required: true, unique : true},      // 用户微信id
    createTime: { type: Date, default: Date.now }, // 创建时间
  });

  return mongoose.model('resident', residentSchema);

};
