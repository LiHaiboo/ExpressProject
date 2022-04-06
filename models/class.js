const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    tutor:String,
    name:String,
    studentIDs:[String],
    tutor_name:String
});

// 导出模块
module.exports = mongoose.model('Class', ClassSchema);
