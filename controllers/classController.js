var Student = require('../models/student');
var Tools = require('../tools');
var countGPA = Tools.countGPA;

exports.class_detail = async function(req,res,next){

    let student = await Student.findOne({studentID:req.session.loginUser},).populate('class').exec();
    let student_list = student.class.studentIDs;
    let results = [];
    let GPAs = [];
    for(i = 0; i < student_list.length; i++){
        let findResult = await Student.findOne({studentID:student_list[i]});

        let GPA = await countGPA(student_list[i]);

        console.log(GPA);
        results.push(findResult);
        GPAs.push(GPA);
    }
    console.log(results);
    console.log(GPAs);

    res.render('class_detail',{myclass:student.class,student_list:results,current_user:req.session.loginUser,GPAs:GPAs});
}






