var Report = require('../models/report');
var Student_Course = require('../models/student_course');
var Academic_Output = require('../models/academic_output');
var Stu_Competition = require('../models/stu_competition');
var Student = require('../models/student');
var Competition = require('../models/competition');
var moment = require('moment');

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

exports.grade_report_create_get = async function(req,res,next){
    let grade = await Student_Course.findById(req.params.id);
    let stu = await Student.findOne({studentID:grade.studentID});
    res.render('report_form',{report_type:'grade',report_object:grade,stu_name:stu.student_name});
}


exports.grade_report_create_post = async function(req,res,next){
    let grade = await Student_Course.findById(req.params.id);
    let stu = await Student.findOne({studentID:grade.studentID});

    var new_report = new Report(
        {
            studentID:req.session.loginUser,
            report_object:await Student_Course.findById(req.params.id),
            reason:req.body.reason,
            status:'未审核',
            comment:'',
            time:moment(Date.now()).format('YYYY年MM月DD日'),
            reported_stu:stu._id,
            report_type:'grade'
        });

    console.log(new_report);

    new_report.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new record.
        // res.type('html');
        res.render('report_create_success',{title:'举报成功'});
    });
}



exports.competition_report_create_get = async function(req,res,next){
    let competition = await Stu_Competition.findById(req.params.id).populate('competition');
    let stu = await Student.findOne({studentID:competition.studentID});
    res.render('report_form',{report_type:'competition',report_object:competition,stu_name:stu.student_name});
}


exports.competition_report_create_post = async function(req,res,next){
    let stu_competition = await Stu_Competition.findById(req.params.id);
    let stu = await Student.findOne({studentID:stu_competition.studentID});

    var new_report = new Report(
        {
            studentID:req.session.loginUser,
            report_object:await Stu_Competition.findById(req.params.id),
            reason:req.body.reason,
            status:'未审核',
            comment:'',
            time:moment(Date.now()).format('YYYY年MM月DD日'),
            reported_stu:stu._id,
            report_type:'competition'
        });

    console.log(new_report);

    new_report.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new record.
        // res.type('html');
        res.render('report_create_success',{title:'举报成功'});
    });
}



exports.output_report_create_get = async function(req,res,next){
    let output = await Academic_Output.findById(req.params.id);
    let stu = await Student.findOne({studentID:output.studentID});
    res.render('report_form',{report_type:'output',report_object:output,stu_name:stu.student_name});
}

exports.output_report_create_post = async function(req,res,next){
    let output = await Academic_Output.findById(req.params.id);
    let stu = await Student.findOne({studentID:output.studentID});

    var new_report = new Report(
        {
            studentID:req.session.loginUser,
            report_object:await Academic_Output.findById(req.params.id),
            reason:req.body.reason,
            status:'未审核',
            comment:'',
            time:moment(Date.now()).format('YYYY年MM月DD日'),
            reported_stu:stu._id,
            report_type:'output'
        });

    console.log(new_report);

    new_report.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new record.
        // res.type('html');
        res.render('report_create_success',{title:'举报成功'});
    });
}

