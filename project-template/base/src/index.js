import ReactDom from 'react-dom';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import IndexComponent from './web_components/Index.js';
import configureStore from "configureStore";
const store = configureStore();
window.store = store;
const root = document.getElementsByClassName('root')[0];
const render = Component => {
    ReactDom.hydrate(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
            {/* <Component /> */}
        </AppContainer>,
        root
    )
}
const render1 = Component => {
    ReactDom.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
            {/* <Component /> */}
        </AppContainer>,
        root
    )
}

render1(IndexComponent);//如果为非热加载 则使用render渲染  热加载则使用hydrate渲染
if (module.hot) {
    module.hot.accept('./web_components/Index.js', () => {
        const NextApp = require('./web_components/Index.js').default;
        render(NextApp)
    })
}


//可以用于importAll
// let reducers = [];
//
// function importAll(r) {
//     r.keys().forEach(key => {
//         let route = r(key).default;
//         reducers.push(route);
//     });
// }
//
// importAll(require.context('./web_router', true, /reducer.js$/));
// function returnObj(reducers) {
//     let obj = {};
//     reducers.map((item) => {
//         obj[item.name] = item.fun
//     })
//     return obj;
// }
//
// let redu = combineReducers({
//     // http1: http1,
//     ...returnObj(reducers)
// })