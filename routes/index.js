//加载Express模块并使用它来获取对象
var express = require('express');
var router = express.Router();

// /* GET home page. */
// //在router对象上指定路由，该路由定义了一个回调，每当检测到具有正确模式的 HTTP 请求时，都会调用该回调
// router.get('/', function(req, res, next) {
//
//   //render方法用于将变量插入指定模板中
//   res.render('index', { title: 'Express' });
//
// });

// GET 请求主页
router.get('/', (req, res) => {
  var sess = req.session;
  var loginUser = sess.loginUser;
  var isLogined = !!loginUser;

  if(isLogined){
    res.redirect('/catalog');
  }else{
    res.redirect('/login');
  }
});


// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


//导出路由
module.exports = router;
