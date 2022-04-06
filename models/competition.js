const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompetitionSchema = new Schema({
    name:String,
    level:String,
    sponsor:String
});

// 虚拟属性'url'：藏书副本 URL
CompetitionSchema
    .virtual('url')
    .get(function () {
        return '/catalog/competitions/' + this._id;
    });

// 导出模块
module.exports = mongoose.model('Competition', CompetitionSchema);
