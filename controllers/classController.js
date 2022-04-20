var Student = require('../models/student');
var Tools = require('../tools');
var countGPA = Tools.countGPA;
var countCompetitionScore = Tools.countCompetitionScore;
var countOutputScore = Tools.countOutputScore;
var countScoreSum = Tools.countScoreSum;

exports.class_detail = async function(req,res,next){

    let student = await Student.findOne({studentID:req.session.loginUser},).populate('class').exec();
    let student_list = student.class.studentIDs;
    let results = [];
    let GPAs = [];
    let outputScores = [];
    let competitionScores = [];
    let sumScores = [];
    for(i = 0; i < student_list.length; i++){
        let findResult = await Student.findOne({studentID:student_list[i]});
        let competitionScore = await countCompetitionScore(student_list[i]);
        let GPA = await countGPA(student_list[i]);
        let outputScore = await countOutputScore(student_list[i]);
        let sumScore = await  countScoreSum(student_list[i]);
        results.push(findResult);
        GPAs.push(GPA);
        competitionScores.push(competitionScore);
        outputScores.push(outputScore);
        sumScores.push(sumScore);
    }

    res.render('class_detail',{myclass:student.class,student_list:results,current_user:req.session.loginUser,GPAs:GPAs,competitionScores:competitionScores,outputScores:outputScores,sumScores:sumScores});
}






