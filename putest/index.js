// const puppeteer = require('puppeteer');
//
// function test (){
//     (async () => {
//         const browser = await puppeteer.launch({
//             // 无界面 默认为true,改成false,则可以看到浏览器操作，目前生成pdf只支持无界面的操作。
//             headless: false,
//             // 开启开发者调试模式，默认false, 也就是平时F12打开的面版
//             devtools: true,
//         });
//         const page = await browser.newPage();
//         await page.goto("https://www.huobi.io/zh-cn/");
//         await page.waitForSelector('.btcusdt');
//         const promise = new Promise((res, rej) => {setTimeout(() => {res()}, 2000)});
//         await promise;
//         const res = await page.evaluate(() => {
//             let test =  document.querySelector(".btcusdt > .rate");
//             return test.innerHTML;
//         });
//         console.log(res);
//         await browser.close();
//     })();
// }
//
//
// setInterval(test, 5000);
//





const puppeteer = require('puppeteer');
let dataArr = [
    '20191216',
    '20191217',
    '20191218',
    '20191219',
    '20191220',
    '20191223',
    '20191224',
    '20191225',
    '20191226',
    '20191227',
    '20191230',
    '20191231',
    '20200102',
    '20200103',
    '20200106',
    '20200107',
    '20200108',
    '20200109',
    '20200110',
    '20200113',
    '20200114',
    '20200115',
    '20200116',
    '20200117',
    '20200120',
    '20200121',
    '20200122',
    '20200123',
    '20200203',
    '20200204',
    '20200205',
    '20200206',
    '20200207',
];
let index = 0;

const getData = (str) => {
    return new Promise ((resolve, rej) => {
        (async () => {
            const browser = await puppeteer.launch({
                // 无界面 默认为true,改成false,则可以看到浏览器操作，目前生成pdf只支持无界面的操作。
                headless: true,
                // 开启开发者调试模式，默认false, 也就是平时F12打开的面版
                devtools: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.goto(`http://stock.10jqka.com.cn/api/znxg/${str}.html`);
            // await page.waitForSelector('.screen-table');
            const promise = new Promise((res, rej) => {setTimeout(() => {res()}, 1000)});
            await promise;
            const res = await page.evaluate(() => {
                let test =  document.querySelectorAll(".screen-table-wrapper .screen-table tbody");
                let lastTest = test[test.length - 1];
                let children = lastTest.children;
                let length = children.length;

                console.warn(length);
                let arr = [];
                for(let i = 0; i < length; i++){
                    // console.warn(children[i]);
                    console.warn(children[i].children[0].children[0].innerHTML);
                    arr.push(children[i].children[0].children[0].innerHTML);
                };
                return arr;
            });
            await browser.close();
            resolve(res);
            return res;
        })();
    });
};


// dataArr.map((item, index) => {
//     let todayArr = test(item);
//     let tomorrowArr = test(dataArr[index + 1]);
//     console.warn(todayArr, tomorrowArr);
// })

let todayData = false;
let tomorroyData = false;
// getData().then((res) => {
//     console.warn(res);
//     todayData = res;
// });
// getData().then((res) => {
//     console.warn(res);
//     tomorroyData = res;
//     index++;
// });

let sum = 0;

let inter = setInterval(() => {
    if(index === dataArr.length){
        clearInterval(inter);
        return;
    }
    console.warn('---------');
    console.warn(dataArr[index]);
    getData(dataArr[index]).then((res) => {
        console.warn(res);
        index++;
        if(!todayData) {
            todayData = res;
            return;
        }
        if(tomorroyData){
            todayData = tomorroyData;
        }
        tomorroyData = res;
        let count = 0;
        todayData.map((item, index) => {
            if(tomorroyData.includes(item)){
                count++;
            }
        });
        console.warn(count/todayData.length);
        sum+=(count/todayData.length);
        console.warn(sum/(index - 1));
        
    })
}, 3000)


