// import {connect} from 'react-redux'
// import {injectAsyncReducer} from 'reducer';
// import propTypes from 'prop-types';
// import {forEach, isString, isFunction} from 'lodash';
// /**
//  * 注入reducer,connect
//  * @param reducerMap
//  * @param connectArgs
//  * @returns {function(*=): {contextTypes, new(*=, *=): {}}}
//  */
// export default (reducerMap = {}, ...connectArgs) => (Index) => class extends connect(...connectArgs)(Index) {
//     constructor(props, context, ...args) {
//         // 必须在super之前调用
//         console.warn(props, context, ...args);
//         let {store} = context;
//         forEach(reducerMap, (reducer, name) => {
//             isString(name) &&
//             isFunction(reducer) &&
//             !(name in store.asyncReducers) &&
//             injectAsyncReducer(store, name, reducer);
//         });
//         super(props, context, ...args);
//     }
//     // constructor(props){
//     //     console.warn(props);
//     // }
//
//     // static contextTypes = {
//     //     store: propTypes.object
//     // };
// };
//
// // export default function inject(reducerMap = {}, ...connectArgs){
// //     return (Index) => {
// //         console.warn(Index);
// //         // console.warn(typeof(Index));
// //         return(
// //             class extends connect(...connectArgs)(Index){
// //                 constructor(props, context, ...args){
// //                     console.warn(props);
// //                     super(props, context, ...args)
// //                 }
// //             }
// //
// //         )
// //     }
// // }



import {connect} from 'react-redux'
import {injectAsyncReducer} from '../reducer/index';
import propTypes from 'prop-types';
import {forEach, isString, isFunction} from 'lodash';
export default (reducerMap = {}, ...connectArgs) => (Index) => class extends connect(...connectArgs)(Index) {
    constructor(props, context, ...args) {
        let {store} = context;
        forEach(reducerMap, (reducer, name) => {
            isString(name) &&
            isFunction(reducer) &&
            !(name in store.asyncReducers) &&
            injectAsyncReducer(store, name, reducer);
        });
        super(props, context, ...args);
    }

    static contextTypes = {
        store: propTypes.object
    };
};
