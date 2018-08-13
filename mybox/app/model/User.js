'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const codeSchema = new mongoose.Schema({
    phone:{type: String, required: true, unique: { index: true }},
    name:{type: String },
    age:{type:String},
    gender:{type: String},
    password:{type:String},
    location:{type:String},
    email:{type:String, required: true, unique: { index: true}},
    createTime: { type: Date, default: Date.now }, // 创建时间
  });

  return mongoose.model('user', codeSchema);

};
