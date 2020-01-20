// function* helloWorldGenerator() {
//     console.log('Hello' + (yield)); // OK
//     console.log('Hello' + (yield 123)); // OK
// }
//
// var hw = helloWorldGenerator();
//
//
// console.warn(hw.next())
// console.warn(hw.next(true))
// console.warn(hw.next())
// console.warn(hw.next())


let pro = new Promise((res, rej) => {
    setTimeout(() => {res('test')}, 2000)
});

pro.then((param) => {
    console.warn(param);
}).catch((e) => {
    console.warn(e);
});