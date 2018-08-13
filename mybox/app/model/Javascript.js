'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const codeSchema = new mongoose.Schema({
    type:{type: String},
    title:{type: String },
    content:{type: String},
    createTime: { type: Date, default: Date.now }, // 创建时间
  });

  return mongoose.model('javascript', codeSchema);

};
