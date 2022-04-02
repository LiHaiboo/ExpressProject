const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompetitionSchema = new Schema({
    name:String,
    level:String,
    sponsor:String
});

// 导出模块
module.exports = mongoose.model('Competition', CompetitionSchema);
