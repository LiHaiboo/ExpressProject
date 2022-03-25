// 导入节点库
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var identityKey = 'LHB';

// 处理相关路由
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const catalogRouter = require('./routes/catalog');  // 导入 catalog 路由

// 创建对象
var app = express();

// 设置 Mongoose 连接
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/local_library';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// 连接成功
db.on('open', function(){
  console.log('MongoDB Connection Successed');
});
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

// 设置视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 将中间件库添加到请求处理链中
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name: identityKey,
  secret: 'LHB',  // 用来对session id相关的cookie进行签名
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 3*24*1000*60*60  // 有效期，单位是毫秒
  },
  rolling: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));//静态资源

// 将上面导入的路由处理代码添加到请求处理链中，定义路由
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/catalog', catalogRouter);  // 将 catalog 路由添加进中间件链

// 错误处理
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('http://localhost:3000/')
//暴露出去
module.exports = app;
