const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, max: 14, min: 3},
    password: {type: String, required: true, max: 14, min: 5},
    permission: {type:String, required: true}
});

// 导出 User 模块
module.exports = mongoose.model('User', UserSchema);

