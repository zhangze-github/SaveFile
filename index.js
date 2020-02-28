// function debounce(fn, wait = 50) {
//     // 通过闭包缓存一个定时器 id
//     let timer = null;
//     // 将 debounce 处理结果当作函数返回
//     // 触发事件回调时执行这个返回函数
//     return function(...args) {
//         // 如果已经设定过定时器就清空上一次的定时器
//         if (timer) clearTimeout(timer)
//         // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
//         timer = setTimeout(() => {
//             fn.apply(this, args)
//         }, wait)
//     }
// }
// // DEMO
// // 执行 debounce 函数返回新函数
// const betterFn = debounce(() => console.log('fn 防抖执行了'), 1000)
// // 停止滑动 1 秒后执行函数 () => console.log('fn 防抖执行了')
// let count = 0;
// let time = setInterval(() => {
//     betterFn();
//     count++;
//     if(count ===100){
//         clearInterval(time);
//     }
// }, 10);
//

console.warn('test');

console.warn(process);