var User = require('./models/user');
var Student_Course = require('./models/student_course');
var Course = require('./models/course');
var Stu_Competition = require('./models/stu_competition');
var Competition_Rule = require('./models/competition_rule');
var Academic_Output = require('./models/academic_output');
var Paper_info = require('./models/paper_info');
var Config = require('./models/config');


var countGPA = async function(studentID) {
    let courses = await Student_Course.find({studentID: studentID});
    let GPA = 0;
    let credit_amount = 0;
    for (let i = 0; i < courses.length; i++) {
        let course_detail = await Course.findOne({courseID: courses[i].courseID});
        credit_amount += course_detail.credit;
        if (courses[i].grade >= 90) {
            GPA += 4 * course_detail.credit;
        } else if (courses[i].grade >= 60) {
            let this_gpa = (courses[i].grade / 10 - 5).toFixed(2);
            GPA += (courses[i].grade / 10 - 5) * course_detail.credit;
        } else {
            GPA += 0;
        }
    }
    GPA /= credit_amount;
    return (GPA).toFixed(2);
}

var countCompetitionScore = async function(studentID){
    let score = 0;
    let competitions = await Stu_Competition.find({studentID:studentID}).populate('competition');
    let rule = await Competition_Rule.findById("625f6ce0c086f03155c702a2");
    for(let i=0;i<competitions.length;i++){
        let this_score;
        if(competitions[i].competition.level==='A'){
            this_score = rule.a;
        }else{
            this_score = rule.b;
        }
        switch (competitions[i].award){
            case'全国一等奖':this_score *= rule.na_1;break;
            case'全国二等奖':this_score *= rule.na_2;break;
            case'全国三等奖':this_score *= rule.na_3;break;
            case'全省一等奖':this_score *= rule.pr_1;break;
            case'全省二等奖':this_score *= rule.pr_2;break;
            case'全省三等奖':this_score *= rule.pr_3;break;
        }
        score += this_score;
    }
    if(score > rule.max)score=rule.max;
    return score.toFixed(1);
}

var countOutputScore = async function(studentID) {
    let score = 0;
    let outputs = await Academic_Output.find({studentID: studentID});
    let config = await Config.findById("625f7e42c086f03155c702c3");
    for (let i = 0; i < outputs.length && outputs[i].status === '已审核'; i++) {
        let this_score;
        let author = (outputs[i].level === '第一作者') ? 1 : 0.3;
        let category = outputs[i].category;
        let category_score = await Paper_info.findOne({category: category});
        this_score = author * category_score.weight;
        score += this_score;
    }
    if (score > config.output_weight)
        score = config.output_weight;
    return score.toFixed(1);
}

module.exports = {
    //权限判断
    permission_judge:function(username, permission, callback) {
        User.findOne({username: username}).exec((err, result) => {
            if (result.permission == permission) {
                callback();
                return true;
            } else {
                return false;
            }
        })
    },
    countGPA:countGPA,
    countCompetitionScore:countCompetitionScore,
    countOutputScore:countOutputScore,
    countScoreSum: async function(studentID){
        let config = await Config.findById("625f7e42c086f03155c702c3");
        let grade_score = await countGPA(studentID);
        grade_score = grade_score/4*config.grade_weight;
        console.log('chengji:' + grade_score);
        let output_score = await countOutputScore(studentID);
        let rule = await Competition_Rule.findById("625f6ce0c086f03155c702a2");
        let competition_score = await countCompetitionScore(studentID)/rule.max * config.competition_weight;
        return (Number(grade_score) + Number(output_score) + Number(competition_score)).toFixed(2);
    }
}