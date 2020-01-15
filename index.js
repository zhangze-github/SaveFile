
//
// console.warn(typeof(a));
// var a = 3;
// var a = function(){};




// function getLastCount(){
//     var thisHour = new Date().getHours();
//     var thisMunite = new Date().getMinutes();
//     var lastCount = 0;
//     if(thisHour < 8){
//         lastCount = 1000 - (1000 * (((60 * thisHour) + thisMunite) / (60 * 8)));
//         return Math.round(lastCount);
//     }
//     if(thisHour < 20){
//         lastCount = 1000 - (1000 * (((60 * (thisHour - 8)) + thisMunite) / (60 * 12)));
//         return Math.round(lastCount);
//     }
//     if(thisHour < 24){
//         lastCount = 500 - (500 * (((60 * (thisHour - 20)) + thisMunite) / (60 * 4)));
//         return Math.round(lastCount);
//     }
// }



import ActionTypes from './utils/actionTypes'
// 导出的就是一个方法 传入reducer方法 初始的state 以及增强器
export default function createStore(reducer, preloadedState, enhancer) {
    let currentReducer = reducer //当前的reducer函数
    let currentState = preloadedState // 当前的页面的state
    let currentListeners = [] // 当前的订阅事件数组 里面存的都是方法
    let nextListeners = currentListeners // 用于更新的订阅数组
    let isDispatching = false // 当前是否在dispatch执行中
    // 其实就是浅克隆 nextListeners
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }
    // 传说中的getState方法 其实就是把当前作用域内的currentState变量返回
    // 注意不要直接改引用啊
    function getState() {
        return currentState
    }
    // 订阅方法 传入一个数组，并将其推入订阅数组内
    function subscribe(listener) {
        ensureCanMutateNextListeners()
        nextListeners.push(listener)
        // 返回一个方法 将该订阅方法从订阅数组中移除
        // 这里不需要传入任何方法 利用闭包记住需要取消订阅的是哪个
        return function unsubscribe() {
            const index = nextListeners.indexOf(listener)
            nextListeners.splice(index, 1)
        }
    }
    // dispatch方法 传入一个action 将其传入reducer中得到新的state
    function dispatch(action) {
        try {
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        // 同时将订阅数组内的全部方法执行一遍
        // 这里保证在订阅数组的方法执行的过程中 不会去更新reducer
        const listeners = (currentListeners = nextListeners)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener()
        }

        return action
    }
    // 替换reduer
    function replaceReducer(nextReducer) {
        currentReducer = nextReducer
        dispatch({ type: ActionTypes.REPLACE })
    }

    // 创建的时候执行一个初始化的action
    dispatch({ type: ActionTypes.INIT })
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
    }
}




