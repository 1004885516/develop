'use strict';
/*
  管理员表
 */
module.exports = app => {
  const mongoose = app.mongoose;

  const userSchema = new mongoose.Schema({
    username:{type:String, required: true},
    pwd:{type: String},
    estate_id:{type: String},
    createTime: { type: Date, default: Date.now }, // 创建时间
  });

  return mongoose.model('user', userSchema);

};