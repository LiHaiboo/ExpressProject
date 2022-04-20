var Competition = require('../models/competition');
var Stu_Competition = require('../models/stu_competition');
var Student = require('../models/student');
var Tools = require('../tools');
var countCompetitionScore = Tools.countCompetitionScore;

exports.competition_list = function(req, res, next){

    Stu_Competition.find({studentID:req.session.loginUser,status:'已审核'})
        .populate('competition')
        .exec(async function (err, list_competition) {
            if (err) { return next(err); }
            // Successful, so render
            console.log(list_competition);
            let score = await countCompetitionScore(req.session.loginUser);
            console.log(score);
            res.render('competition_list', { title: '我的竞赛', competition_list: list_competition, score:score});
        });

}


exports.competition_detail = function(req, res, next){

    Competition.findById(req.params.id)
        .exec(function (err, competition_info) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('competition_detail', { title: competition_info.name, competition: competition_info });
        });
}

exports.competition_info = async function (req, res, next){

      let this_student = await Student.findById(req.params.id);
      Stu_Competition.find({studentID:this_student.studentID})
          .populate('competition')
          .exec(function (err, list_competition) {
              if (err) { return next(err); }
              console.log(list_competition);
              res.render('competition_list_class', { title: this_student.student_name + '的竞赛', competition_list: list_competition });
          });


}
