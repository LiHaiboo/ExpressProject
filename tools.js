var User = require('./models/user');


function permission_judge(username,permission,callback){
    User.findOne({username:username}).exec((err,result)=> {
        if (result.permission == permission) {
            callback();
            return true;
        }else{
            return false;
        }
    })
}

//暴露出去
module.exports = permission_judge;