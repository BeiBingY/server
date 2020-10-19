const mongoose = require("mongoose");

// 链接数据库
mongoose.connect("mongodb://localhost/server", { useNewUrlParser: true, useUnifiedTopology: true });

// 禁用警告：DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

// 链接异常监听
db.on('error', function(err) {
    console.log('数据库链接错误', err);
})

// 链接断开监听
db.on('disconnected', function(err) {
    console.log('数据库链接断开', err);
})

/* 链接成功 */
db.once('open', function() {
    console.log("数据库链接成功")
})

module.exports = mongoose;