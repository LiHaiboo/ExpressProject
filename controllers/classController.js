var Student = require('../models/student');

exports.class_detail = async function(req,res,next){

    let student = await Student.findOne({studentID:req.session.loginUser},).populate('class').exec();
    let student_list = student.class.studentIDs;
    let results = [];
    for(i = 0; i < student_list.length; i++){
        let findResult = await Student.findOne({studentID:student_list[i]});
        results.push(findResult);
    }

    res.render('class_detail',{myclass:student.class,student_list:results,current_user:req.session.loginUser});
}






