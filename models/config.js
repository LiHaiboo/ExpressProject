const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConfigSchema = new Schema({
    grade_weight:Number,
    output_weight:Number,
    competition_weight:Number
});

// 导出模块
module.exports = mongoose.model('Config', ConfigSchema);
