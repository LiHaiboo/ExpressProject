var Config = require('../models/config');
var Competition_Rule = require('../models/competition_rule');

exports.sum_rule_get = async function(req, res, next){
    let rule = await Config.findById("625f7e42c086f03155c702c3");
    res.render('rule_sum', { rule: rule });
}

exports.sum_rule_post = async function(req, res, next){
    console.log('***************************');
    let rule = await Config.findById("625f7e42c086f03155c702c3");
    rule.grade_weight = req.body.grade_weight;
    rule.output_weight = req.body.output_weight;
    rule.competition_weight = req.body.competition_weight;
    console.log(rule);
    Config.findByIdAndUpdate("625f7e42c086f03155c702c3", rule, {}, function (err, theReport) {
        if (err) {
            return next(err);
        }
        res.redirect('/catalog/rules/sum');
    });
}

exports.competition_rule_get = function(req, res, next){

}

exports.competition_rule_post = function(req, res, next){

}
