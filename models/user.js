const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, max: 14, min: 3},
    password: {type: String, required: true, max: 14, min: 5},
    permission: {type: String, required: true},
    real_name: {type: String, required: false}
});

// 虚拟属性'称号'，用于显示
UserSchema
    .virtual('title')
    .get(function () {
        switch (this.permission) {
            case 'student': return '学生'; break;
            case 'tutor': return '导师'; break;
            case 'admin': return '管理员'; break;
            default: return '未知用户' + this.username;
        }
    });

// 导出 User 模块
module.exports = mongoose.model('User', UserSchema);

