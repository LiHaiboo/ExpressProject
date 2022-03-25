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
        }],(err, data) => {
        res.render('grade_list', {title: '课内成绩', error: err, data_list: data});
    })
};