import {
    HTTP_LOADING,
    HTTP_SUCCESS,
    HTTP_ERROR,
    HTTP_CANCEL,

    HTTP_GET_LOADING,
    HTTP_GET_SUCCESS,
    HTTP_GET_ERROR,

    HTTP_COMPELETE,
    HTTP_CANCEL_ALL,
    HTTP_TIMEOUT,
    PUSH_QUEUE,
    PULL_QUEUE,
    PULL_ALL_QUEUE
} from 'constants/http';

import {isEmpty, isString, isPlainObject, isFunction, isArray, defaultTo, isBoolean, merge} from 'lodash';
import {parse, stringify} from 'qs';

const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    // 'X-UI-V': __VERSION__
};

const initalOptions = {
    type: 'GET',
    headers: headers,
    timeout: HTTP_TIMEOUT,
    cache: false
};

export const requestCompelete = (options = {}) => {
    return {
        type: HTTP_COMPELETE,
        ...options
    }
};

export const requestLoading = (options = {}) => {
    return {
        type: HTTP_LOADING,
        ...options
    }
};

export const requestSuccess = (options = {}) => {
    return {
        type: HTTP_SUCCESS,
        ...options
    }
};

export const requestError = (options = {}) => {
    return {
        type: HTTP_ERROR,
        ...options
    }
};

export const requestCancel = (options = {}) => {
    return {
        type: HTTP_CANCEL,
        ...options
    }
};

const defaultRequestPayload = {
    preventCancel: false, // 阻止请求被取消
    preventMessage: false, // 阻止默认消息提示信息
    queue: false, // 是否加入操作队列, 接收字符串参数
    only: false // 是否唯一加载
};

/**
 * 发起HTTP请求
 * @param defaultOptions
 * @param types
 * @param payload
 * @returns {{options: {method: string, headers: {"X-Requested-With": string, "X-UI-V": *}, timeout, cache: boolean}, payload: {}, types: *[]}}
 */
export const request = (defaultOptions = initalOptions, types = [], payload = {}) => {
    if (isEmpty(defaultOptions.url)) throw new Error('url is empty!');

    if (isBoolean(payload)) {
        payload = {
            preventCancel: payload,
            queue: false
        }
    }

    if (isString(payload)) {
        payload = {
            preventCancel: false,
            queue: payload
        }
    }

    if (!isPlainObject(payload)) {
        throw new Error('request payload allowed [type boolean], [type object]!');
    }

    if (isString(types)) types = [null, {type: types}, null, null];
    else if (isPlainObject(types) || isFunction(types)) types = [null, types, null, null];
    else if (!isArray(types)) throw new Error('types allowed [type stirng], [action], [func action]');

    let options = {
        ...initalOptions,
        timeout: defaultTo(payload.timeout, initalOptions.timeout),
        ...defaultOptions
    };
    // options.headers['X-Source-Path'] = window.location.pathname; // 回传发起请求的页面

    payload = {
        ...defaultRequestPayload,
        ...payload
    };

    return {
        options,
        payload,
        types: [
            defaultTo(types[0], null),
            defaultTo(types[1], null),
            defaultTo(types[2], null),
            defaultTo(types[3], null)
        ]
    };
};

/**
 * 发起GET请求
 * @param url
 * @param data
 * @param types
 * @param preventCancel
 * @returns {{options, payload, types}}
 */
export const get = (url, data = {}, types = [], preventCancel = false) => {
    if (isEmpty(url)) throw new Error('url is empty!');
    const options = {
        type: 'GET',
        url,
        data
    };
    return request(options, types, preventCancel);
};

/**
 * 发起POST请求
 * @param url
 * @param data
 * @param types
 * @param preventCancel
 * @returns {{options, payload, types}}
 */
export const post = (url, data = {}, types = [], preventCancel = false) => {
    if (isEmpty(url)) throw new Error('url is empty!');
    const options = {
        type: 'POST',
        headers: {
            ...headers,
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        url,
        data
    };
    return request(options, types, preventCancel);
};

/**
 * 发起PUT请求
 * @param url
 * @param data
 * @param types
 * @param preventCancel
 * @returns {{options, payload, types}}
 */
export const put = (url, data = {}, types = [], preventCancel = false) => {
    if (isEmpty(url)) throw new Error('url is empty!');
    const options = {
        type: 'PUT',
        headers: {
            ...headers,
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        url,
        data
    };
    return request(options, types, preventCancel);
};

/**
 * 发起DELETE请求
 * @param url
 * @param data
 * @param types
 * @param preventCancel
 * @returns {{options, payload, types}}
 */
export const del = (url, data = {}, types = [], preventCancel = false) => {
    if (isEmpty(url)) throw new Error('url is empty!');
    let a = document.createElement('a');
    a.href = url;

    // 若data参数不为空则合并到query查询参数
    if(!isEmpty(data)) {
        let query = parse(a.search, {ignoreQueryPrefix: true});
        // 合并参数
        a.search = stringify({
            ...query,
            ...data
        }, { addQueryPrefix: true });
    }
    // DELETE请求，一些服务端会忽略掉body参数
    const options = {
        type: 'DELETE',
        url: a.href
    };
    return request(options, types, preventCancel);
};

/**
 * 取消队列中的请求
 * @param xhr
 * @returns {{type: string, payload: *}}
 */
export const cancel = (xhr) => ({type: HTTP_CANCEL, payload: xhr});

/**
 * 取消队列全部请求
 * @returns {{type}}
 */
export const cancelAll = () => ({type: HTTP_CANCEL_ALL});

// export const addQueue = (queue) => ({type: PUSH_QUEUE, payload: queue});
//
// export const removeQueue = (queue) => ({type: PULL_QUEUE, payload: queue});
//
// export const removeAllQueue = () => ({type: PULL_ALL_QUEUE});
