'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const codeSchema = new mongoose.Schema({
    phone:{type: String, required: true, unique: { index: true }},
    code:{type: String },
    createTime: { type: Date, default: Date.now }, // 创建时间
  });

  return mongoose.model('verifyCode', codeSchema);

};
