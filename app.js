const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const log4js = require('./resources/logger/logConfig');
const devConfig = require('./resources/config/devConfig');
const bodyParser = require('body-parser');
const voteLoveRouter = require('./routes/tryforlove/voteLove');//路由
const managerRouter = require('./routes/votemanger/voteManager');//路由
const vaoteRouter = require('./src/controller/tryforlove/voteUserController');
const app = express();

/*******session设置*********/
app.use(cookieParser());
app.use(session({
  name: "voteManager", //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  secret: 'vote159753',  // 用来对session id相关的cookie进行签名
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 60 * 60 * 1000  // 有效期，单位是毫秒
  }
}));

/********安全域名微信校验文件********/
app.use("/MP_verify_q6hqYTetNIr2prDo.txt",function (req, res) {
  vaoteRouter.getMpVerify(req, res);
});

/*******设置跨域访问 及请求拦截器*********/
app.all('*',function (req, res, next) {
  //设置全局访问
  res.header('Access-Control-Allow-Origin', '*');
  //告诉客户端可以在HTTP请求中带上Cookie
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, voteToken');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  //检查post的信息或者url查询参数或者头信息
  let token = req.headers['votetoken'];
  // log4js.logger.info(req.headers);
  log4js.logger.info("当前token为====> " + token);
  let checkLogin = token === undefined ? false : token;
  log4js.logger.info("登陆token验证====> " + checkLogin);
  if (req.method === 'OPTIONS') {
    res.send(200);//让options请求快速返回
  } else if (checkLogin) { //判断是否登录
    // 确认token
    jwt.verify(token, devConfig.secretOrPrivateKey.secret, function(err, decoded) {
      if (err) {
        res.send({ success: false, status:'301',message: 'token信息错误.' });
      } else {
        // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
        req.api_user = decoded;
        log4js.logger.info("token解析用户信息: ", req.api_user);
        next();
      }
    });
  }else {
    // 解析用户请求的路径
    let arr = req.url.split('/');
    // 判断请求路径、登录、注册、登出，如果是不做拦截
    if ((arr.length > 2 && arr[2] !== 'manager') || arr[3] === 'register' || arr[3] === 'login' || arr[3] === 'loginOut') {
      next();
    } else {  // 登录拦截
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
      res.send({success:false, status:'403', message:'请先登录'});
      log4js.logger.info({success:false, status:'403', message:'请先登录'});
    }
  }
});

/*******日志组件log4js*******/
log4js.use(app);
app.use(express.json());
//最大传输
app.use(bodyParser.urlencoded({extended:false,limit : "5000kb"}));
app.use(express.urlencoded({ extended: false }));

/*******请求路由*********/
app.use('/vote/manager', managerRouter);
app.use('/vote/tryforlove', voteLoveRouter);


/***** catch 404 and forward to error handler *****/
app.use(function(req, res, next) {
  next(createError(404));
});

/***** error handler *****/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
