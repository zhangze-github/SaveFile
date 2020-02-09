var axios = require('axios');


axios.get('http://stock.10jqka.com.cn/api/znxg/20200124.html').then((res) => {
    console.warn(res);
})