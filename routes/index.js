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
  res.redirect('/catalog');
});

//导出路由
module.exports = router;
