const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    axios.get('https://car.autohome.com.cn/2sc/loadbrand.ashx?area=beijing&brand=&ls=&spec=0&minPrice=0&maxPrice=0&minRegisteAge=0&maxRegisteAge=0&MileageId=0&disp=0&stru=0&gb=0&color=0&source=0&listview=0&sell=1&newCar=0&credit=0&sort=0&kw=&ex=c0d0t0p0w0r0u0e0s0a0o0i0b0').then(data => {
        res.send(data.data)
    }).catch(err => {
        res.send(err)
    })
});

module.exports = router;
