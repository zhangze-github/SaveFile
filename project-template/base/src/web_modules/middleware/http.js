import {isPlainObject, isFunction, isArray, isEmpty, isString, find} from 'lodash';
import {ajax} from 'jquery';
import {requestLoading, requestSuccess, requestError, requestCancel, requestCompelete, cancel} from '../actions/http';
import {message} from 'antd';

export default store => next => action => {
    let {types, options, payload, nextAction} = action;
    // console.log(action);
    if (!isArray(types) || !isPlainObject(options)) return next(action);

    if (!isPlainObject(options)) throw new Error('Expected an options.');

    if (typeof options.url !== 'string') throw new Error('Specify a string URL.');

    if (!isArray(types) || types.length !== 4) throw new Error('Expected an array of three action types.');

    let [loading, success, error, compelete] = types;

    let {preventCancel, preventMessage, queue, only} = payload;

    nextAction && store.dispatch(nextAction);

    // 判断是否唯一请求队列
    if (only) {
        let xhrs = store.getState().http.xhrs;
        let xhr = find(xhrs, {name: queue});
        xhr && store.dispatch(cancel(xhr));
    }
    // console.warn(options);
    let xhr = ajax({
        ...options,
        beforeSend: (xhr) => {
            xhr.preventCancel = preventCancel;
            if (isString(queue)) xhr.name = queue;
            dispatchAction(store.dispatch, loading, {
                xhr
            });
        },
        success: (data, status) => {
            if (status === 'abort') {
                xhr.aborted = true;
                return;
            }

            store.dispatch(requestSuccess({
                payload: data,
                xhr,
                status
            }));

            // if (data.resultCode === 'ARES0000') {
            if(true){
                dispatchAction(store.dispatch, success, {
                    payload: data.resultData,
                    xhr,
                    status
                });
            } else {
                if (!preventMessage) {
                    // 开发环境，错误提示包含返回码，其它环境去掉返回码
                    // if (__DEV__) message.error(`[${data.resultCode}]${data.resultDesc || '操作失败'}`);
                    if (true) message.error(`[${data.resultCode}]${data.resultDesc || '操作失败'}`);
                    else message.error(`${data.resultDesc || '操作失败'}`);
                }
                dispatchAction(store.dispatch, error, {
                    error: data,
                    xhr,
                    status
                });
            }
        },
        error: (xhr, status, err) => {
            if (status === 'abort') {
                xhr.aborted = true;
                return;
            }

            if (!preventMessage) {
                if (status === 'timeout') message.error('请求超时！');
                else message.error('请求失败！');
            }

            // console.log('请求被终止', xhr, status, err);
            store.dispatch(requestError({
                xhr,
                error: err,
                status
            }));

            dispatchAction(store.dispatch, error, {
                xhr,
                error: err,
                status
            });
        },
        complete: (xhr, status) => {
            if (status === 'abort') {
                xhr.aborted = true;
                return;
            }
            store.dispatch(requestCompelete({
                xhr,
                status
            }));

            dispatchAction(store.dispatch, compelete, {
                xhr,
                status
            });
        },
        statusCode: {
            401: function () {
                switch(__LAYOUT__) {
                    case 'portal': {
                        window.location = '/ams/login';
                        break;
                    }
                    case 'console': {
                        window.location = '/bms/login';
                        break;
                    }
                    default: {
                        window.location = '/ams/login';
                        break;
                    }
                }
            }
        }
    });

    next(requestLoading({
        xhr
    }));
};

function dispatchAction(dispatch, action, options) {
    if (action) {
        // console.log('action', action, options);
        if (isPlainObject(action)) {
            dispatch({
                ...action,
                ...options
            });
        } else if (isFunction(action)) {
            dispatch(action.bind(null, options));
        }
    }
}

// function checkStatus(response) {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     } else {
//         var error = new Error(response.statusText)
//         error.response = response
//         throw error;
//     }
// }
//
// function parseJSON(response) {
//     return response.json();
// }

