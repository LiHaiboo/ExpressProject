const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Stu_CompetitionSchema = new Schema({
    studentID: String,
    competition: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    award: String,
    status:String,
    comment:String
});

// 虚拟属性'url'
Stu_CompetitionSchema
    .virtual('report_url')
    .get(function () {
        return '/catalog/stu_competition/' + this._id +'/report';
    });


// 导出模块
module.exports = mongoose.model('Stu_Competition', Stu_CompetitionSchema);
