const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseID: {type: String, required: true},
    course_name: {type: String, required: true},
    course_name_EN: {type: String, required: true},
    credit: {type: Number, required:true},
    course_nature: {type: String, required:true}
});

// 虚拟属性'url'：课程URL
CourseSchema
    .virtual('url')
    .get(function () {
        return '/catalog/course/' + this._id;
    });


// 导出模块
module.exports = mongoose.model('Course', CourseSchema);