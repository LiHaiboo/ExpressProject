var User = require('./models/user');
var Student_Course = require('./models/student_course');

//权限判断
function permission_judge(username,permission,callback){
    User.findOne({username:username}).exec((err,result)=> {
        if (result.permission == permission) {
            callback();
            return true;
        }else{
            return false;
        }
    })
}

//学生全部课程
function taken_courses(studentID) {
    return Student_Course.find({studentID: studentID})
}

//暴露出去
module.exports = permission_judge;