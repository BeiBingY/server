const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// express的日志模块
const logger = require('morgan');
// 跨域模块
const cors = require('cors');
// token验证模块
const expressJwt = require('express-jwt');
// 自定义模块
const verToken = require('./utils/token');
const config = require("./config");

// 引入路由文件
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(cors());//使用跨域中间件

app.use(function(req, res, next) {
    let token = req.headers['authorization']
    if(!token) {
        return next()
    }else {
        // 获取并解析token
        verToken.getToken(token).then((tokenData) => {
            return next()
        }).catch((error) => {
            return next()
        })
    }
})

// 静态文件路径
// 绝对路径访问 例如： /public/images/1.jpg
// app.use(express.static(__dirname));
// 相对路径访问 例如： /images/1.jpg
app.use(express.static(path.join(__dirname, 'public')));

//验证token是否过期并规定那些路由不需要验证,
//写在静态资源获取之后，避免静态资源无法访问
app.use(expressJwt({
    secret: config.token_screct,
    algorithms: ['HS256']
}).unless({
    //不需要验证的接口名称
    path:[
        '/', 
        '/login', 
        '/register',
        '/favicon.ico',  //解决默认请求/favicon.ico验证问题
    ]  
}))


// 视图模板路径以及使用的类型ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 生产日志
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 分配路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

//验证token失效返回信息
app.use(function(err, req, res, next) {
    if(err.status==401){
        if(err.inner.name == 'TokenExpiredError') {
            return res.status(401).send('token失效，请重新登录')
        }else {
            return res.status(401).send('请先登录')
            // return res.json({message:'token失效'})
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
