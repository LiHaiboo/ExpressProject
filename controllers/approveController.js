var Academic_Output = require('../models/academic_output');
var Class = require('../models/class');
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

    console.log(req.params.id);

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
