// 加密模块
const crypto = require("crypto");

let hmac = function(data) {
    const hmac = crypto.createHmac('md5', 'this_is_secret_key');
    return hmac.update(data).digest('hex');
}

module.exports ={
    hmac
}