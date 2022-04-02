var User = require('../models/user');
var async = require('async');

const { body,validationResult } = require('express-validator');

// Display Genre create form on GET.
exports.login_get = function(req, res, next) {
    res.render('login', { title: '登录' });
};

// Handle Genre create on POST.
exports.login_post =  [

    // Validate that the name field is not empty.
    body('username', 'username required').isLength({ min: 1 }).trim(),
    body('password', 'password required').isLength({ min: 1 }).trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var user = new User(
            {
                username: req.body.username,
                password: req.body.password
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('login', { title: '登录', user: user, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            User.findOne({
                'username': req.body.username,
            }).then(user => {

                console.log(user);

                if(!user){
                    return res.render('login', {title: '登录', user: user, errors:[{msg:'用户名不存在'}]});
                }
                if(req.body.password != user.password){
                    return res.render('login', {title:'登录', user:user, errors:[{msg:'密码错误'}]});
                }

                //生成cookie
                req.session.loginUser = user.username;
                return res.redirect('/catalog');
                });
        }
    }
];

