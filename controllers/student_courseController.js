var Student_Course = require('../models/student_course');
var Student = require('../models/student');
var Course = require('../models/course');
var async = require('async');
var Tools = require('../tools');
var countGPA = Tools.countGPA;
const mongoose = require('mongoose');
let fs = require("fs");
var xlsx = require('xlsx');

// Display list of all Books.
exports.grade_list = function(req, res, next) {
    Student_Course.aggregate([{
            $lookup:{
                from:"courses",
                localField:"courseID",
                foreignField:"courseID",
                as:"course_detail"
            }
        },{
            $match:{
                studentID: req.session.loginUser
            }
        }],async(err, data) => {
        const allSemesters = await Student_Course.distinct('semester',{studentID: req.session.loginUser});
        let GPA = await countGPA(req.session.loginUser);
        res.render('grade_list', {title: '课内成绩', error: err, data_list: data, semester_list: allSemesters, GPA:GPA});
    })
};


exports.grade_query_post = (req, res, next) => {
    let query = {$match:{}};
    if(req.body.courseID) query.$match.courseID = new RegExp(req.body.courseID);
    if(req.body.course_name) query.$match.course_name = new RegExp(req.body.course_name);
    if(req.body.semester) query.$match.semester = req.body.semester;
    query.$match.studentID = req.session.loginUser;


    console.log(query.$match);

    Student_Course.aggregate([{
        $lookup:{
            from:"courses",
            localField:"courseID",
            foreignField:"courseID",
            as:"course_detail"
        }
    },query],async(err, data) => {
        const allSemesters = await Student_Course.distinct('semester',{studentID: req.session.loginUser});
        let GPA = await countGPA(req.session.loginUser);
        res.render('grade_list', {title: '课内成绩', error: err, data_list: data, semester_list: allSemesters, GPA:GPA});
    })
};

exports.grade_upload_get = (req, res, next) => {
    res.render('grade_upload');
}

exports.grade_upload_post = (req, res, next) => {
    console.log(req.file);

    if (typeof(req.file)=='undefined') {
        return res.send("上传文件不能为空！");
    } else {
        if (!req.file.originalname.endsWith('xls') && !req.file.originalname.endsWith('xlsx')) {
            return res.send("请上传xls或xlsx格式的文件");
        }

        let file = req.file;
        let fileInfo = {};

        fs.renameSync('public/grades/' + file.filename, 'public/grades/' + file.originalname);//这里修改文件名字，比较随意。
        // 获取文件信息
        fileInfo.mimetype = file.mimetype;
        fileInfo.originalname = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = file.path;

        // Parse a file
        const workFile = xlsx.readFile("public/grades/"+file.originalname);
        const sheet = workFile.Sheets[workFile.SheetNames[0]];
        const result = xlsx.utils.sheet_to_json(sheet);


        console.log(result[0].学号);

        for (i = 0, len = result.length; i < len; i++) {


        var student_course = new Student_Course({
                studentID: result[i].学号,
                courseID: result[i].课程号,
                course_name: result[i].课程名,
                grade: result[i].成绩,
                semester: result[i].学期,
                comment:typeof(result[i].不及格原因)=='undefined'?'':result[i].不及格原因
            })
            student_course.save(function (err) {
                if (err) { return next(err); }
            });
        }

        res.render('grade_upload_success',{title:'成绩已提交成功'});


        // 设置响应类型及编码
        // res.set({
        //     'content-type': 'application/json; charset=utf-8'
        // });
    }

}
//
// exports.grade_detail_get = async (req,res,next) => {
//
//     let this_student = await Student.findOne({_id:req.params.id});
//     console.log(this_student);
//
//     Student_Course.aggregate([{
//         $lookup:{
//             from:"courses",
//             localField:"courseID",
//             foreignField:"courseID",
//             as:"course_detail"
//         }
//     },{
//         $match:{
//             studentID: this_student.studentID
//         }
//     }],async(err, data) => {
//         const allSemesters = await Student_Course.distinct('semester',{studentID: this_student.studentID});
//         res.render('grade_list', {title: '课内成绩', error: err, data_list: data, semester_list: allSemesters});
//     })
//
// }

// exports.grade_detail_post = async (req,res,next) => {
//
//     let this_student = await Student.findById(req.params.id);
//     let query = {$match:{}};
//     if(req.body.courseID) query.$match.courseID = new RegExp(req.body.courseID);
//     if(req.body.course_name) query.$match.course_name = new RegExp(req.body.course_name);
//     if(req.body.semester) query.$match.semester = req.body.semester;
//     query.$match.studentID = this_student.studentID;
//
//
//     console.log(query.$match);
//
//     Student_Course.aggregate([{
//         $lookup:{
//             from:"courses",
//             localField:"courseID",
//             foreignField:"courseID",
//             as:"course_detail"
//         }
//     },query],async(err, data) => {
//         const allSemesters = await Student_Course.distinct('semester',{studentID: this_student.studentID});
//         res.render('grade_list', {title: '查询结果', error: err, data_list: data, semester_list: allSemesters});
//     })
//
// }

exports.grade_info_get = async function(req, res, next) {
    let this_student = await Student.findOne({_id:req.params.id});
    console.log(this_student);

    Student_Course.aggregate([{
        $lookup:{
            from:"courses",
            localField:"courseID",
            foreignField:"courseID",
            as:"course_detail"
        }
    },{
        $match:{
            studentID: this_student.studentID
        }
    }],async(err, data) => {
        const allSemesters = await Student_Course.distinct('semester',{studentID: this_student.studentID});

        console.log('/catalog/grade/' + data[0]._id + '/report');
        res.render('grade_list_class', {title: '课内成绩', error: err, data_list: data, semester_list: allSemesters});
    })
};


exports.grade_info_post = async (req, res, next) => {
    let this_student = await Student.findById(req.params.id);
    let query = {$match:{}};
    if(req.body.courseID) query.$match.courseID = new RegExp(req.body.courseID);
    if(req.body.course_name) query.$match.course_name = new RegExp(req.body.course_name);
    if(req.body.semester) query.$match.semester = req.body.semester;
    query.$match.studentID = this_student.studentID;


    console.log(query.$match);

    Student_Course.aggregate([{
        $lookup:{
            from:"courses",
            localField:"courseID",
            foreignField:"courseID",
            as:"course_detail"
        }
    },query],async(err, data) => {
        const allSemesters = await Student_Course.distinct('semester',{studentID: this_student.studentID});
        res.render('grade_list_class', {title: '查询结果', error: err, data_list: data, semester_list: allSemesters});
    })
};