var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const verToken = require('./utils/token');
const expressJwt = require('express-jwt');

const config = require("./config");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors());//使用跨域中间件

app.use(function(req, res, next) {
    let token = req.headers['authorization']
    if(!token) {
      return next()
    }else {
      verToken.getToken(token).then((tokenData) => {
        // req.data = tokenData
        return next()
      }).catch((error) => {
        return next()
      })
    }
})

//验证token是否过期并规定那些路由不需要验证
app.use(expressJwt({
  secret: config.token_screct,
  algorithms:['HS256']
}).unless({
  path:['/login','/register']  //不需要验证的接口名称
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//验证token失效返回信息
app.use(function(err,req,res,next){
  if(err.status==401){
    if(err.inner.name == 'TokenExpiredError') {
      return res.status(401).send('token失效，请重新登录')
    }else {
      return res.status(401).send('请先登录')
       //可以设置返回json 形式  res.json({message:'token失效'})
    }
  }
})

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

module.exports = app;
