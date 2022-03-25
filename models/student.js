const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    studentID: {type: String, required: true},
    student_name: {type: String, required: true},
    classID: {type:String, required: true}
});

// 虚拟属性'url'：学生URL
StudentSchema
    .virtual('url')
    .get(function () {
        return '/catalog/student/' + this._id;
    });

// 导出模块
module.exports = mongoose.model('Student', StudentSchema);

