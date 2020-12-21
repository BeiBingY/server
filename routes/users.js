const express = require('express');
// 引入请求
const axios = require('axios');
// 引入cheerio为服务器特别定制的，快速、灵活、实施的jQuery核心实现
const cheerio = require('cheerio');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // axios.get('https://car.autohome.com.cn/2sc/loadbrand.ashx?area=beijing&brand=&ls=&spec=0&minPrice=0&maxPrice=0&minRegisteAge=0&maxRegisteAge=0&MileageId=0&disp=0&stru=0&gb=0&color=0&source=0&listview=0&sell=1&newCar=0&credit=0&sort=0&kw=&ex=c0d0t0p0w0r0u0e0s0a0o0i0b0').then(data => {
    //     res.send(data.data)
    // }).catch(err => {
    //     res.send(err)
    // })
    axios.get('http://m.8080s.net/movie/1-2-1-0-0-1').then(data => {
      let items = [];
      let $ = cheerio.load(data.data);
      $('div.list_mov').each(function(idx, element) {
          let $element = $(element);
          // 获取子级img标签，然后提取其src
          let $subElement = $element.find('img');
          let thumbImgSrc = $subElement.attr('src');
          // 获取子级a标签，然后提取其对应的href
          let $subElementHref = $element.find('a');
          let aSrc = $subElementHref.attr('href');

          let $subElementTitle = $element.find('h4>a');
          let title = $subElementTitle.text();
        
          items.push({
              title: title,
              href: aSrc,
              thumbSrc: thumbImgSrc
          });

      });
      console.log(items)
      res.send(data.data)
    }).catch(err => {
        res.send(err)
    })
    
});

module.exports = router;
