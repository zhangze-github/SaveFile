const puppeteer = require('puppeteer');

function test (){
    (async () => {
        const browser = await puppeteer.launch({
            // 无界面 默认为true,改成false,则可以看到浏览器操作，目前生成pdf只支持无界面的操作。
            headless: true,
            // 开启开发者调试模式，默认false, 也就是平时F12打开的面版
            devtools: true,
        });
        const page = await browser.newPage();
        await page.goto("https://www.huobi.io/zh-cn/");
        await page.waitForSelector('.btcusdt');
        const promise = new Promise((res, rej) => {setTimeout(() => {res()}, 2000)});
        await promise;
        const res = await page.evaluate(() => {
            let test =  document.querySelector(".btcusdt > .rate");
            return test.innerHTML;
        });
        console.log(res);
        await browser.close();
    })();
}


setInterval(test, 10000);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// const puppeteer = require('puppeteer');
//
// function test (){
//     (async () => {
//         const browser = await puppeteer.launch({
//             // 无界面 默认为true,改成false,则可以看到浏览器操作，目前生成pdf只支持无界面的操作。
//             headless: true,
//             // 开启开发者调试模式，默认false, 也就是平时F12打开的面版
//             devtools: true,
//         });
//         const page = await browser.newPage();
//         await page.goto("http://quote.eastmoney.com/sh601901.html#fullScreenChart");
//         // await page.waitForSelector('.btcusdt');
//         const promise = new Promise((res, rej) => {setTimeout(() => {res()}, 2000)});
//         await promise;
//         const res = await page.evaluate(() => {
//             let test =  document.querySelector("#price9");
//             return test.innerHTML;
//         });
//         console.log(res);
//         await browser.close();
//     })();
// }
//
//
// setInterval(test, 10000);
