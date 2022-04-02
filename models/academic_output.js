const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AcademicOutputSchema = new Schema({
    name:String,
    category:String,
    studentID:String,
    level:String,
    evident:String,
    time:String,
    status:String,
    comment:{type:String, required:false}
});

// 虚拟属性'url'
AcademicOutputSchema
    .virtual('url')
    .get(function () {
        return '/catalog/academic_outputs/' + this._id;
    });

// 虚拟属性'url'
AcademicOutputSchema
    .virtual('approve_url')
    .get(function () {
        return '/catalog/approve/output/' + this._id;
    });

//虚拟属性'isAuthorize'
AcademicOutputSchema.virtual('isAuthorized')
    .get(function(){
        if(this.status == '已审核')return true;
        else return false;
    });


// 导出 Book 模块
module.exports = mongoose.model('Academic_Output', AcademicOutputSchema);