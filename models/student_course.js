const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Student_CourseSchema = new Schema({
    studentID: {type: String, required: true},
    courseID: {type: String, required: true},
    grade: {type:String, required: true},
    semester: {type:String, required: true},
    comment: {type:String, required: false},
    course_name: {type:String, required:true}
});


// 虚拟属性'url'
Student_CourseSchema
    .virtual('url')
    .get(function () {
        return '/catalog/grade/' + this._id +'/report';
    });

// 虚拟属性'url'
Student_CourseSchema
    .virtual('xxx')
    .get(function () {
        return this.studentID;
    });


// 导出模块
module.exports = mongoose.model('Student_Course', Student_CourseSchema);
