const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Competition_RuleSchema = new Schema({
    a:Number,
    b:Number,
    max:Number,
    na_1:Number,
    na_2:Number,
    na_3:Number,
    pr_1:Number,
    pr_2:Number,
    pr_3:Number
});

// 虚拟属性'url'：藏书副本 URL
Competition_RuleSchema
    .virtual('info')
    .get(function () {
        return '竞赛分数等于竞赛权重乘以奖项分数，分数上限为' + this.max + ' \r\n其中A类竞赛权重为' + this.a + ',B类竞赛权重为'
            + this.b + '\r\n国家级奖项分数分别为:一等奖' + this.na_1 + '分' + ',二等奖' + this.na_2 + '分' + ',三等奖'
            + this.na_3 + '分' + '\r\n省级奖项分数分别为:一等奖' + this.pr_1 + '分' + ',二等奖' + this.pr_2 + '分'
            + ',三等奖' + this.pr_3 + '分';
    });


// 导出模块
module.exports = mongoose.model('Competition_Rule', Competition_RuleSchema);
