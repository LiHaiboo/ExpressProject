var Student_Course = require('../models/student_course');
var Course = require('../models/course');
var async = require('async');
const mongoose = require('mongoose');

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
        res.render('grade_list', {title: '课内成绩', error: err, data_list: data, semester_list: allSemesters});
    })
};


exports.grade_query_post = (req, res, next) => {
    console.log('111:',req.body);
    let query = {$match:{}};
    if(req.body.courseID) query.$match.courseID = new RegExp(req.body.courseID);
    if(req.body.course_name) query.$match.course_name = new RegExp(req.body.course_name);
    if(req.body.semester) query.$match.semester = req.body.semester;


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
        res.render('grade_list', {title: '查询结果', error: err, data_list: data, semester_list: allSemesters});
    })
};