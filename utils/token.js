const jwt = require("jsonwebtoken");
const config = require("../config");
const jwtScrect = config.token_screct;  //签名

// 生成token
let setToken = function(user_name, user_id) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ user_name: user_name, user_id: user_id }, jwtScrect, { expiresIn: 7*24*60*60 })
        resolve(token)
    })
}

let getToken = function(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject({
                error: 'token 是空的'
            })
        }
        else {
            let info = jwt.verify(token.split(' ')[1], jwtScrect);
            resolve(info);  //解析返回的值（sign 传入的值）
        }
    })
}

module.exports = {
    setToken,
    getToken
}