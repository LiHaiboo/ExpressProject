var Competition = require('../models/competition');
var Stu_Competition = require('../models/stu_competition');

exports.competition_list = function(req,res,next){
    console.log(req.session.loginUser);

    Stu_Competition.find({studentID:req.session.loginUser})
        .populate('competition')
        .exec(function (err, list_competition) {
            if (err) { return next(err); }
            // Successful, so render
            console.log(list_competition);
            res.render('competition_list', { title: '我的竞赛', competition_list: list_competition });
        });

}


exports.competition_detail = function(req,res,next){

    Competition.findById(req.params.id)
        .exec(function (err, competition_info) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('competition_detail', { title: competition_info.name, competition: competition_info });
        });
}
