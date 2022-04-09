var Report = require('../models/report');
var Student_Course = require('../models/student_course');
var Academic_Output = require('../models/academic_output');
var Stu_Competition = require('../models/stu_competition');
var Student = require('../models/student');
var Competition = require('../models/competition');

exports.report_list = function(req,res,next){
    Report.find({studentID:req.session.loginUser}).populate('reported_stu').exec(function (err, list_reports) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('report_list', { title: '我的举报', report_list: list_reports });
    })
}


exports.report_detail = async function(req,res,next){

    let this_report = await Report.findById(req.params.id);
    let is_grade = true, is_output = true, is_competition = true;

    console.log(await Student_Course.findById(this_report.report_object));
    if(await Student_Course.findById(this_report.report_object)===null){
        is_grade = false;
    }
    if(await Stu_Competition.findById(this_report.report_object)==null){
        is_competition = false;
    }
    else is_output = false;

    let report_type;
    if(is_grade === true){report_type = 'Student_Course';}
    else if(is_competition === true){report_type = 'Stu_Competition';}
    else{report_type = 'Academic_Output';}

    console.log(report_type);

    Report.findById(req.params.id).populate('reported_stu').populate({
        path: 'report_object',
        model: report_type // 在集合中查找该ID
    }).exec( function (err, result) {
        if (err) { return next(err); }
        console.log(result);


        //Successful, so render
        res.render('report_detail', { title: '举报详情', report: result, report_type: report_type});
    })
}

