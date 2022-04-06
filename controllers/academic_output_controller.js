var Academic_Output = require('../models/academic_output');
var Paper_Info = require('../models/paper_info');
let fs = require("fs");

exports.academic_output_list = function(req,res,next){
    Academic_Output.find()
        .exec(function (err, list_outputs) {
            if (err) { return next(err); }
            console.log(list_outputs);
            //Successful, so render
            res.render('academicoutput_list', { title: '论文专利', output_list: list_outputs });
        });
}

exports.output_detail = function(req,res,next){
    Academic_Output.findById(req.params.id)
        .exec(function (err, my_output) {
            if(err) {return next(err); }
            console.log(req.params.id);
            console.log(my_output);
            res.render('academicoutput_detail',{ title: '项目名', output: my_output });
        });
}

exports.output_create_get = function(req,res,next){
    Paper_Info.find({},'category')
        .exec(function (err, categories) {
            if (err) { return next(err); }
            // Successful, so render.
            console.log(categories);
            res.render('academicoutput_form',{title:'添加论文或专利',paper_list:categories});
        });
}

exports.output_create_post = function (req, res, next) {

    if (typeof(req.file)=='undefined') {  //判断一下文件是否存在，也可以在前端代码中进行判断。
        res.send("上传文件不能为空！");
        return;
    } else {
        let file = req.file;
        let fileInfo = {};

        fs.renameSync('public/evidences/' + file.filename, 'public/evidences/' + file.originalname);//这里修改文件名字，比较随意。
        // 获取文件信息
        fileInfo.mimetype = file.mimetype;
        fileInfo.originalname = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = file.path;

        // 设置响应类型及编码
        // res.set({
        //     'content-type': 'application/json; charset=utf-8'
        // });


        // Create a BookInstance object with escaped and trimmed data.
        var new_output = new Academic_Output(
            {
                name:req.body.name,
                category:req.body.category,
                studentID:req.session.loginUser,
                level:req.body.level,
                evident:'/evidences/'+ file.originalname,
                time:req.body.time,
                status:'未审核',
                comment:''
            });
            // Data from form is valid.
            new_output.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new record.
                // res.type('html');
                res.render('academicoutput_create_success',{title:'提交成功'});
            });
    }
}
