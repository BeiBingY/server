let express = require('express')
let router = express.Router()
// 上传文件模块，配合 fs模块和 path模块使用
let multer = require('multer')
let fs = require('fs');
let path = require('path');

let upload = multer({
	storage: multer.diskStorage({
		//设置文件存储位置
		destination: function(req, file, cb) {
			let date = new Date();
			let year = date.getFullYear();
			let month = (date.getMonth() + 1).toString().padStart(2, '0');
			let day = date.getDate();
			let dir = "public/images/" + year + month + day;
			//判断目录是否存在，没有则创建
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, {
					recursive: true
				});
			}

			//dir就是上传文件存放的目录
			cb(null, dir);
		},
		//设置文件名称
		filename: function(req, file, cb) {
			let fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            //fileName就是上传文件的文件名
			cb(null, fileName);
		}
	})
});
/**
 * upload方法的使用
 * upload.single('key值'):当传递单个文件的时候，对文件的解析
 * upload.array('key值', maxCout)：当传递一组文件的时候，对文件的解析 key值是前端传递的key值 maxcout是最多能传递多少个文件
 * upload.fields([{ name: 'key值', maxCount: num }, { name: 'key值', maxCount: num }])：当传递多个文件域的时候,对文件的解析
*/

// 单个图片上传
router.post('/', upload.single('file'), (req, res) => {
    res.send({
        data: {
            file: req.file
        }
    })
})

// 多个图片上传
router.post('/arr', upload.array('files', 3), (req, res) => {
    res.send({
        data: {
            files: req.files
        }
    })
})

module.exports = router