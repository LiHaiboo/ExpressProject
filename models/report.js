const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    studentID:String,
    report_object:Schema.Types.ObjectId,
    reason:String,
    status:String,
    comment:String,
    time:String,
    reported_stu:{type: Schema.Types.ObjectId, ref: 'Student', required: true},
    report_type:String
});

// 虚拟属性'url'
ReportSchema
    .virtual('url')
    .get(function () {
        return '/catalog/reports/' + this._id;
    });

// 虚拟属性'url'
ReportSchema
    .virtual('approve_url')
    .get(function () {
        return '/catalog/approve/report/' + this._id;
    });


ReportSchema
    .virtual('zh_type')
    .get(function () {
        if(this.report_type === 'competition')return '竞赛';
        else if(this.report_type === 'output')return '论文专利';
        else return '成绩';
    });

module.exports = mongoose.model('Report', ReportSchema);