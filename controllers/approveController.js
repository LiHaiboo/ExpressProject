var Academic_Output = require('../models/academic_output');
var Class = require('../models/class');
var Report = require('../models/report');
var Student = require('../models/student');
var Competition = require('../models/competition');
var Student_Course = require('../models/student_course');
var Stu_Competition = require('../models/stu_competition');
var async = require('async');


exports.approve_list = function(req, res, next) {
    res.render('approve_list',{title:'审批任务'});
}

exports.output_approve_get = function(req,res,next) {
    //拿loginUser在Class表寻找所有学生，输出他们的项目
    async.waterfall([
            function(callback) {
                //查询出班级内所有学生,students
                //console.log(req.session.loginUser);
                Class.findOne({tutor:req.session.loginUser}, function(err,class_result){
                        callback(null, class_result.studentIDs);
                    }
                );
            },
            async function (students, callback) {
                let results = [];


                //用students里每一项查询academic output，合并到数组result
                for (i = 0, len = students.length; i < len; i++) {
                    var output_result = await Academic_Output.find({studentID: students[i],status:'未审批'}).exec();
                    //合并数组
                    results.push.apply(results, output_result);
                }

                res.render('approve_output_list',{outputs:results});
                //callback(null, results);
            }]
        //,function (err, results) {

         //}
    );
}

exports.output_approve_detail_get = function(req,res,next){
    Academic_Output.findById(req.params.id)
        .exec(function (err, my_output) {
            if(err) {return next(err); }
            res.render('approve_output_detail',{ title: '项目名', output: my_output });
        });
}

exports.output_approve_detail_post = async function(req, res, next) {

    let output = await Academic_Output.findById(req.params.id).exec();

    console.log(output);
    output.status = req.body.status;

    console.log(req.body.comment);
    if (typeof (req.body.comment) === undefined) {
        output.comment = '';
    } else {
        output.comment = req.body.comment;
    }

    Academic_Output.findByIdAndUpdate(req.params.id,output,{},function (err,theOutput) {
        if(err){return next(err);}
        res.redirect('/catalog/approve/output');
    });

}

exports.report_approve_get = async function(req,res,next) {
    let my_class = await Class.findOne({tutor:req.session.loginUser});
    let students = my_class.studentIDs;
    let results = [];
    console.log(students);
    //用students里每一项查询academic output，合并到数组result
    for (i = 0, len = students.length; i < len; i++) {
        var report_result = await Report.find({studentID: students[i],status:'未审核'}).populate('reported_stu');
        console.log(report_result);
        //合并数组
        results.push.apply(results, report_result);
    }
    console.log(results);
    res.render('approve_report_list',{reports:results});
}

exports.report_approve_detail_get = async function(req,res,next) {
    let this_report = await Report.findById(req.params.id);
    let stu = await Student.findOne({studentID:this_report.studentID});
    let report_type = this_report.report_type;
    switch (report_type) {
        case "grade":
            let grade_report = await Report.findById(req.params.id).populate('reported_stu').populate({path:'report_object',model:'Student_Course'});
            res.render('approve_report_detail_grade',{grade_report:grade_report,stu:stu});
            break;
        case "output":
            let output_report = await Report.findById(req.params.id).populate('reported_stu').populate({path:'report_object',model:'Academic_Output'});
            res.render('approve_report_detail_output',{output_report:output_report,stu:stu});
            break;
        case "competition":
            let competition_report = await Report.findById(req.params.id).populate('reported_stu').populate({path:'report_object',model:'Stu_Competition'});
            let competition_detail = await Competition.findById(competition_report.report_object.competition);
            console.log(competition_detail);
            res.render('approve_report_detail_competition',{competition_report:competition_report,this_competition:competition_detail,stu:stu});
            break;
        default:res.send('啥也不是');
    }

}

exports.report_approve_detail_post = async function (req, res, next) {
    let this_report = await Report.findById(req.params.id);

    console.log(this_report);
    this_report.status = req.body.status;

    if (typeof (req.body.comment) === undefined) {
        this_report.comment = '';
    } else {
        this_report.comment = req.body.comment;
    }

    //审核通过后的处理
    let report_type = this_report.report_type;
    if (this_report.status === '已审核') {
        switch (report_type) {
            case "grade":
                let this_grade = await Student_Course.findById(this_report.report_object);
                this_grade.comment = '无效';
                await Student_Course.findByIdAndUpdate(this_report.report_object,this_grade);
                break;
            case "output":
                let this_output = await Academic_Output.findById(this_report.report_object);
                this_output.status = '未通过';
                this_output.comment = '经举报撤销';
                await Academic_Output.findByIdAndUpdate(this_report.report_object,this_output);
                break;
            case "competition":
                let this_competition = await Stu_Competition.findById(this_report.report_object);
                this_competition.status = '未通过';
                this_competition.comment = '经举报撤销';
                await Stu_Competition.findByIdAndUpdate(this_report.report_object,this_competition);
                break;
            default:
                res.send('啥也不是');
        }
    }


    Report.findByIdAndUpdate(req.params.id, this_report, {}, function (err, theReport) {
        if (err) {
            return next(err);
        }
        res.redirect('/catalog/approve/report');
    });

}