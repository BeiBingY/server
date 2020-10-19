const db = require("../config/db");
const md5 = require("../utils/md5")
let userSchema = new db.Schema({
    user_account: {
        type: Number,
        // 唯一索引
        unique: true
    },
    user_password: {
        type: String,
        set(val) {
            return md5.hmac(val)
        }
    },
    user_creator_data: {
        type: Date, 
        default: Date.now
    }
})

let users = db.model("user", userSchema);

module.exports = users;