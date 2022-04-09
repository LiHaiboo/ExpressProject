const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    studentID: {type: String, required: true},
    student_name: {type: String, required: true},
    class: {type: Schema.Types.ObjectId, ref: 'Class', required: true}
});

// 虚拟属性'url'：学生URL
StudentSchema
    .virtual('url')
    .get(function () {
        return '/catalog/student/' + this._id;
    });

// 虚拟属性'url'：学生URL
StudentSchema
    .virtual('grade_url')
    .get(function () {
        return '/catalog/grades/' + this._id;
    });

// 虚拟属性'url'：学生URL
StudentSchema
    .virtual('competition_url')
    .get(function () {
        return '/catalog/student/' + this._id + '/competitions';
    });

// 虚拟属性'url'：学生URL
StudentSchema
    .virtual('academic_output_url')
    .get(function () {
        return '/catalog/student/' + this._id + '/academic_outputs';
    });

// 导出模块
module.exports = mongoose.model('Student', StudentSchema);

