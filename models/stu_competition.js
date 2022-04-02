const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Stu_CompetitionSchema = new Schema({
    studentID: String,
    competition: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    award: String
});

// 导出模块
module.exports = mongoose.model('Stu_Competition', Stu_CompetitionSchema);
