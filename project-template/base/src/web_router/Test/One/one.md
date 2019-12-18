Redux 在 React 项目中有着广泛的应用，也是构建大型应用所必须的。关于 Redux 的教程有很多，当然每个教程都有其作者自己的理解方式。Redux 的实现并不复杂，但思想较难理解，这也使得大多教程都变得晦涩。作为初学者，这里简要介绍一下我的理解，理解深度有限，辩证对待。

这里提供两个链接，建议先看阮一峰老师的系列教程一和三，理解后再看二，官网的内容可以作为补充和API说明。

Redux 阮一峰

Redux 官网

使用背景：

React 中，组件之间相互传值或者是共享状态的情景很常见，一般父组件向子组件传值时通过 props 向子组件传递，子组件向父组件传值时要通过 props 先由父向子传递一个 fun ，在通过回调函数的参数将数据从子传到父。如果组件之间嵌套过多，父子之间相互传值通过频繁的管理 props 和 fun 就变成了一件很麻烦的事，而且很容易某个值在某个组件内发生改变因没有注意到而出错。当需要共享状态时，需要将该状态提升到距离两组件最近的共有父级来管理。

Redux 所解决的就是这个问题，试想如果有这样的一棵状态树，就是一个保存所有需要共享状态的容器，我们在整个项目的所有组件内都能够获取到我们想要的状态，同时我们又能在所有组件内绑定改变某些状态的方法，这样就能为我们整个项目的状态管理提供极大的方便。

Redux 的三个概念：（先简单了解，具体要看例子。）

Action ：见名知意，也就是一个动作，行为，只有触发一个 Action 才能改变状态树内的相关数据。
Store：全局状态树，用来保存所有的状态。
Reducer：记住就是一个函数，且是纯函数（这里不做太多解释）。接受两个参数，一个是上一次的状态，一个是刚刚触发的 Action，返回更新后的状态。
Demo:

create-reate-app ReduxDemo
cd ReduxDemo
npm install redux react-redux   ---save
将 src 下 index.js 替换成如下文件
npm start
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
//与 redux 配合使用的 react-redux 提供了 props 绑定的语法糖
import { Provider, connect } from 'react-redux'; 

```js
// Reducer  是一个方法 返回 store 中的 data 传入两个参数 一个是状态默认值 一个是发出的action的对象
function counter(state = { count: 0 }, action) {
    const count = state.count;
    switch (action.type) {
        case 'add':
            return { count: count + 1}
        case "less": 
            return{ count : count -1}
        default:
            return state
    }
}

//  见名知意 将 state 映射到 props
function mapStateToProps(state) {
    return {
        value: state.count
    }
}

// 见名知意 将 fun 映射到 props
function mapDispatchToProps(dispatch) {
    return {
        onAdd: () => dispatch({ type: 'add' }),
        onLess: () => dispatch({ type: 'less' }),
    }
}

// 视图组件 通过 props 可以访问到 store 中的 data 和 fun
class Counter extends Component {
    render() {
        const {value, onAdd, onLess} = this.props;
        return (
            <div>
                <div>{value}</div>
                <button onClick={onAdd}>add</button><br/>
                <button onClick={onLess}>less</button>
            </div>
        )
    }
}

//connect 将 data 和 fun 都绑定到组件 通过 props 访问
const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)

// Store  将reducer结合成store
const store = createStore(counter);

ReactDOM.render(
    // Provider组件 将store绑定到根组件
    <Provider store={store}>  
        <App />
    </Provider>,
    document.getElementById('root')
)
```
这是一个 Redux 的小 Demo，整体虽比较简单，却也完成了单向数据流的实现，下面再来复述一下过程中的数据流动：

首先定义了一个 Reducer 函数，传入两个参数，一个是默认状态，一个是触发的 action 对象，返回更新后的状态。
通过  store = createStore(counter) 结合成状态树，再通过 Provide 绑定到根组件。
通过 mapStateToProps mapDispatchToProps 将 data 和 fun 映射到视图组件。
视图组件通过 props 可以访问到 data 和 fun，组件如果想改变状态，就触发一个 fun。
在 mapDispatchToProps 中触发的 fun 将 dispatch 一个对象。
Reducer 接受到 action 对象后根据根据 type 属性改变相应的状态。
视图组件获取到新的状态后更新 view。
真正应用于项目中的 Redux 要远比 Demo 中的实现复杂。action 理论上只能返回对象，通过 redux-thunk 的扩展，可以使 action 返回一个 fun，同时能够获取到整个状态树的 data 和触发 action。这样就可以将 http 请求也放在 Redux 中来实现。通过 redux-promise 的扩展，可以使 action 返回一个 promise。通过 combineReducers 可以将 Reducer 函数拆分开，同时能够动态的注入 Reducer，将整个Redux 做一个去中心化的处理。通过 applyMiddleware 可以自行的扩展中间件，增强 Redux 的功能。

------------------------------------------------分割线，以上内容为实习期所写，以下内容为应届生项目过程中所写。

借用阮一峰老师的一句话，真正学会React是一个漫长的过程。

异步注入Reducer。

试想，Redux触发一个Action，通常都会有一个Type字段，习惯上全部用大写字母来定义，当触发这个Action后，在整个Store上众多的Reducer中，是如何找到对应的Reducer的。一般在Reducer中，我们都通过SwitchCase来匹配到对应的Reducer。在其内部，一定会一个个的去匹配，过程中一定浪费了大量的效率。再比如，我们当前页面，并不设涉及到整个Store，只使用了一小部分功能，但是任意一个页面的都挂载了我们全部的Store。这也是值得优化的一个点。而Redux提供了一个高级的API，replaceReducer，能够异步替换Reducer。combineReducers的时候只combine一些全局所使用到的Reducer，而配合LazyLoader，每次触发一个新的页面请求，获取到当前页面代码后，同事执行Reducer的替换。这样就避免了Reducer冗余的问题。能够使当前页面的Reducer保持一个最精简的状态，过程中节省了效率。

最新版的react-redux中的connect已经不是一个class了，不容易做继承。但是在5.1.0版本中，我们可以封装一个类，继承于connect，在constructor中获取到store，传入当前的Reducer后异步注入到store中，可以做替换，当触发另一个页面请求后，又将原页面的Reducer替换掉，同时保持一些全局的Reducer还在。

中间件。

类似于express的中间件，在中间的过程中可以做一系列的操作。灵活的一点在于，在每一个中间件的过程中，都可以获取到Store中的State或者是重新Dispatch一个Action。我们触发的Action可以夹杂众多的参数，通过传入特定的参数来在某一个中间件中可以做一些特定的处理。比如有这样一个例子，在我们的snail工程中，通过res.data来在页面请求的过程中来向前端的Store中挂载数据，来避免一个闪屏现象。在发起请求的过程中，我们此时需要一个loading的状态，在请求之前值loading，请求之后再清空。有没有这样一种可能，熟悉JQuery的AJAX可能知道，其中定义了各种声明周期的回调，请求成功的失败的。在中间件中定义触发请求的action，包括与各种声明周期，同时定义一个当前正在请求的数组。在触发请求action的时候，同时传入当前请求的一个标志位，可以是一个字符串，在请求发起时，向该数组中推入标志位，结束后退出，这样在组件内部，通过判断请求数组中是否包含某一项或者某几项，来判断当前某个请求是否在过程中。如果用多个axios来发起请求，判断他们是否全部结束是一件麻烦的事。利用这种办法，在一定程度上会带来一定的方便，但是也是有成本的，需要自行构建中间件。
```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
export default thunk;
```
这里列举一个使用最多，但却是最简单的一个中间件。redux-thunk，其实源码就这几行，功能也很简单，判断我们传入的action是不是一个function，如果是的话就触发一个action，同时传入dispatch和getState。如果不是一个function就直接next到下一个中间件。

我司所用的upDate。

snail工程中的redux架构，所用的中间件也不多，并没有通过增强器和中间件来扩展其复杂的功能，却给使用过程带来了极大的方便。有些公司关于这种状态管理的选型，使用MobX而不使用Redux，有一部分原因就是Redux的使用复杂度，需要自行构建Action，还要写具体的Reducer处理函数，假如说我们只想要单纯地管理一个状态，也要从头到尾地构建一遍。而我司的这种封装方式，恰恰解决了这一问题。在构建Reducer的过程中，使用createReducer方法，通过他创建的Reducer作为一个根Reducer，其内部通过lodash的set方法，来进行内部的状态更新。我们在使用的过程中，通过connect绑定了update方法之后，使用起来就像使用set方法一样，传入根名称，路径，新值，就可以实现store中某一值的更新。createReducer 和update方法如下所示：
```js
export function createReducer(reducer, initial = {}) {
    return function (state = initial, action) {
        const UPDATE = `${reducer}UPDATE`; // 保证combineReducers组合后的reducer的action.type不会重复
        const NEW_UPDATE = `${reducer}NEW_UPDATE`;
        const route = action.route;
        const newData = action.newData;
        const isUpdate = action.isUpdate;
        switch (action.type) {
            case NEW_UPDATE:
                let newState = '';
                if(isUpdate) {
                    if(!route.length) { // route为空字符串或空数组时更新该reducer下整个store
                        return newData;
                    }
                    newState = _cloneDeep(state);
                    _set(newState, route, newData);
                }
                return newState;
            default:
                return state;
        }
    };
}
export function newUpdate(reducer, route, newData) {
    return (dispatch)=>{
        dispatch(
            {
                type: `${reducer}NEW_UPDATE`,
                route: route,
                newData: newData,
                isUpdate: true
            }
        );
    };
}
```
但是这样做也是有所舍弃的，比如说更多的处理逻辑只能放在组件中或者Action中来做，而不能通过Reducer来做。在有些场景，我们可以将一些处理功能单一的逻辑放在Reducer中，将整理好的数据做更新。Redux的单向数据流设计，使用方式的原因，也使得Redux的使用过程有诸多限制，触发更新只能通过dispatch一个Action，状态的更新只能使用纯函数的Reducer。在深入浅出React和Redux中，有这样一句话：如果你愿意限制做事方式的灵活度，你几乎总会发现可以做得更好。下面还有这样一句话，我感觉值得软件开发人员深思：在计算机编程的世界里，完成任何一件任务，可能都有一百种以上的方法，但是无节制的灵活度反而让软件难以维护增加限制是提高软件质量的法门。不知道为什么，就是感觉人家说的好。。。

类比如我看过的一些其他的设计方式，会将action和reducer函数在路由组件下抽离出来来写，组件内部触发action必须通过connect来绑定，同时可以将一些逻辑放在reducer中来处理，在使用方式上做了一定的限制，但却使得单向数据流的逻辑变得更加清晰。我司的update方式使用起来灵活，复杂项目下却容易使得状态管理变得混乱。

这里说一个问题，具体的情况我还没有验证过。我们知道connect只是一个高阶组件，见名知意，将action和state通过props连接到组件内部。与此同时，在其内部也做了一些优化，比如说检测到两次的state数据是一样的，就不会触发props的更新，但是对于引用值就会有一些问题，比如说我们只是单纯地将某个对象添加了一个属性，这种情况就不会触发connect内部的更新，因为检测到引用对象并没有变。用深克隆或者assign可以避免这一现象的发生。在我们的createReducer方法中，set赋值过程之前会进行整体的深克隆，在一定程度上，或者是原始值，或者是引用值，connect内部会不会误触发组件props的更新，从而导致组件无用的重新render，而导致性能的浪费，这一问题还值得探讨。

个人比较喜欢这一部分的东西，就看的稍多一点。无论是React还是Redux，值得学习的东西还有很多。无论是理解深度上还是项目经验上，都还有很多的路要走。以上内容可能有错误或瑕疵的地方，欢迎提出修改意见。关于上面所介绍的几种设计方式，在我的代码中均已实现，也欢迎来与我讨论。



