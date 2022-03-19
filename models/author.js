const mongoose = require('mongoose');
var moment = require('moment');
const { DateTime } = require("luxon");  //for date handling

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

// 虚拟属性'name'：表示作者全名
AuthorSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
    });

// 虚拟属性'lifespan'：作者寿命
// AuthorSchema
//     .virtual('lifespan')
//     .get(function () {
//         return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
//     });
AuthorSchema
    .virtual('lifespan')
    .get(function() {
        var lifetime_string = '';
        if (this.date_of_birth) {
            lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
        }
        lifetime_string += ' - ';
        if (this.date_of_death) {
            lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
        }
        return lifetime_string;
});

// 虚拟属性'birth_formatted'：格式化日期
AuthorSchema
    .virtual('birth_formatted')
    .get(function () {
        return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
    });

// 虚拟属性'death_formatted'：格式化日期
AuthorSchema
    .virtual('death_formatted')
    .get(function () {
        return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
    });

// 虚拟属性'url'：作者 URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

// 导出 Author 模型
module.exports = mongoose.model('Author', AuthorSchema);