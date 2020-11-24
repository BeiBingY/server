var express = require('express');
var router = express.Router();

// 引入自定义token模块
const verToken = require('../utils/token');

// 引入 modul模型 users
const users = require("../model/users");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: '测试', isLogin: req.user || false})
});

// 注册接口
router.post('/register', function(req, res, next) {
    // 新增数据的方法
    users.create({
        user_account: req.body.user_name,
        user_password: req.body.user_password
    },function(err, ret) {
        if(err) {
            // key键重复
            if(err.code == 11000) {
                return res.send("该账号已存在");
            }

            return res.send("注册失败");
        }
        res.send(ret.user_account + '注册成功');
    })
});

// 登录接口
router.post('/login', function(req, res, next) {
    let user_account = req.body.user_name
    let user_password = req.body.user_password
    if(user_account && user_password) {
        // 查询一条数据的方法
        users.findOne({
            user_account: user_account, 
            user_password: req.body.user_password
        }, function(err,ret){
            if(err){
                return res.send({
                    message: '登录失败：查询错误',
                    err: err
                })
            } else {
                if(!ret) {
                    return res.send({
                        message: '登录失败：账号或密码错误'
                    })
                }
                // 设置生成token
                verToken.setToken(ret.user_account, ret._id).then(token => {
                    return  res.send({
                                data: {
                                    message: ret.user_account + '登录成功',
                                    token: token
                                }
                                //前端获取token后存储在localStroage中,
                                //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
                            })
                })
            }
        })
    }else {
        res.send("登录失败：账号或密码错误");
    }
});

module.exports = router;
