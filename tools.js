var User = require('./models/user');
var Student_Course = require('./models/student_course');
var Course = require('./models/course');


module.exports = {
    //权限判断
    permission_judge:function(username, permission, callback) {
        User.findOne({username: username}).exec((err, result) => {
            if (result.permission == permission) {
                callback();
                return true;
            } else {
                return false;
            }
        })
    },
    countGPA:async function(studentID) {
        let courses = await Student_Course.find({studentID: studentID});
        let GPA = 0;
        let credit_amount = 0;
        for (let i = 0; i < courses.length; i++) {
            let course_detail = await Course.findOne({courseID: courses[i].courseID});
            credit_amount += course_detail.credit;
            if (courses[i].grade >= 90) {
                GPA += 4 * course_detail.credit;
            } else if (courses[i].grade >= 60) {
                let this_gpa = (courses[i].grade / 10 - 5).toFixed(2);
                GPA += (courses[i].grade / 10 - 5) * course_detail.credit;
            } else {
                GPA += 0;
            }
        }
        GPA /= credit_amount;
        return (GPA).toFixed(2);
    }
}