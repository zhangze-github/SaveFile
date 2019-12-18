import {
    HTTP_LOADING,
    HTTP_SUCCESS,
    HTTP_ERROR,
    HTTP_COMPELETE,
    HTTP_CANCEL,
    HTTP_CANCEL_ALL,
    PUSH_QUEUE,
    PULL_QUEUE,
    PULL_ALL_QUEUE
} from 'constants/http';
import {isEqual, clone, pull, remove, get, find, isString} from 'lodash';

const initialState = Object.freeze({
    xhrs: Object.freeze([]),
    loading: false,
    queues: Object.freeze([])
});

const http = (state = initialState, action) => {
    switch (action.type) {
        case HTTP_LOADING: {
            let xhrs = state.xhrs.filter((xhr) => !xhr.aborted);
            xhrs.push(action.xhr);
            // 判断是否需要加入队列，一般用于按钮/列表等加载状态loading
            let queues = state.queues;
            let queueName = get(action.xhr, 'name');
            if (queueName) queues = [...queues, queueName];
            return Object.freeze({
                ...state,
                xhrs: Object.freeze(xhrs),
                queues,
                loading: true
            });
        }
        case HTTP_SUCCESS: {
            let xhrs = state.xhrs.filter((xhr) => !xhr.aborted);
            return Object.freeze({
                ...state,
                xhrs: Object.freeze(xhrs),
                loading: xhrs.length > 0
            });
        }
        case HTTP_ERROR: {
            let xhrs = state.xhrs.filter((xhr) => !xhr.aborted);
            if (action.xhr.aborted) {
                pull(xhrs, action.xhr);
            }
            // else {
            // if(action.status === 'timeout') message.error('请求超时！');
            // else message.error('请求失败！');
            // }

            return Object.freeze({
                ...state,
                xhrs: Object.freeze(xhrs),
                loading: xhrs.length > 0
            });
        }
        case HTTP_COMPELETE: {
            let xhrs = state.xhrs.filter((xhr) => !xhr.aborted);
            pull(xhrs, action.xhr);

            // 判断是否需要加入队列，一般用于按钮/列表等加载状态loading
            let queues = [...state.queues];
            let queueName = get(action.xhr, 'name');
            queueName && pull(queues, queueName);

            return Object.freeze({
                ...state,
                xhrs: Object.freeze(xhrs),
                queues: Object.freeze(queues),
                loading: xhrs.length > 0
            });
        }
        case HTTP_CANCEL: {
            let xhrs = [...state.xhrs];
            let queues = [...state.queues];
            let xhr = isString(action.payload) ? find(xhrs, {name: action.payload}) : action.payload;
            if (xhr) {
                !xhr.preventCancel && xhr.abort();
                pull(xhrs, xhr);
                pull(queues, xhr.name);
                return Object.freeze({
                    ...state,
                    xhrs: Object.freeze(xhrs),
                    queues: Object.freeze(queues),
                    loading: xhrs.length > 0
                });
            }
            return state;
        }
        case HTTP_CANCEL_ALL: {
            let xhrs = state.xhrs.filter((xhr) => {
                if (!xhr.preventCancel) {
                    xhr.abort();
                    return false;
                }
                return true;
            });
            return Object.freeze({
                ...state,
                xhrs: Object.freeze(xhrs),
                queues: Object.freeze([]),
                loading: xhrs.length > 0
            });
        }
        case PUSH_QUEUE: {
            let queues = [...state.queues, action.payload];
            return Object.freeze({
                ...state,
                queues: Object.freeze(queues)
            });
        }
        case PULL_QUEUE: {
            let queues = [...action.payload];
            pull(queues, action.payload);
            return Object.freeze({
                ...state,
                queues: Object.freeze(queues)
            });
        }
        case PULL_ALL_QUEUE: {
            return Object.freeze({
                ...state,
                queues: Object.freeze([])
            });
        }
        default: {
            return state;
        }
    }
};

export default http;
