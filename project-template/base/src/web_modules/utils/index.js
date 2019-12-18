import {values, keys, concat, find, isEmpty, isBoolean, isString, isArray, fromPairs, compact, isPlainObject, trim, map, pick, flatten} from 'lodash';
import {parse} from 'qs';
import {matchPath} from 'react-router';
// import connect from 'react-redux/lib/connect/connect';
import {connect} from 'react-redux';
// import bindActionCreators from 'redux/lib/bindActionCreators';
import {bindActionCreators} from 'redux';
import md5 from 'md5';
import propTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import jquery from 'jquery';
import pinyin from 'simple-pinyin';
// str
import inject from './inject';

/**
 * 获取action type 名称，用于规范命名
 * @param moduleName
 * @param componentName
 * @returns {Function}
 */
export const createActionType = function (moduleName, componentName) {
    if (__DEV__) {
        if (isEmpty(moduleName) || !isString(moduleName)) {
            throw new Error('方法getActionType第一参数moduleName（模块名）为必填字符串');
        }

        if (isEmpty(componentName) || !isString(componentName)) {
            throw new Error('方法getActionType第二参数componentName（组件名）为必填字符串');
        }
    }

    return function (...actoinNames) {
        const upperCaseReg = /^[A-Z]+([_][A-Z]+)*$/;
        let strs = [moduleName, componentName, ...actoinNames];

        if (__DEV__) {
            if (isEmpty(actoinNames)) {
                throw new Error('请填写至少一个参数');
            }

            strs.forEach((str, index) => {
                if (!upperCaseReg.test(str)) {
                    throw new Error('方法getActionType参数必须为大写字母（A-Z）、下划线（_）组成的字符串');
                }
            });

        }

        return strs.join('_');
    }
};

/**
 * 序列化对象签名
 * @param o
 * @returns {*}
 */
export const obJectToId = function (o) {
    return arrayToId(concat(keys(o), values(o)));
};

/**
 * 序列化数组签名
 * @param arr
 * @returns {*}
 */
export const arrayToId = function (arr) {
    return md5(arr.sort().join());
};

/**
 * 编码参数
 * @param params
 * @returns {string}
 */
export const encodeParams = function (params = {}) {
    return encodeURI(encodeURI(JSON.stringify(params)));
};

/**
 * 解码参数
 * @param params
 * @returns {string}
 */
export const decodeParams = function (params = '{}') {
    return JSON.parse(decodeURI(decodeURI(params)));
};


/**
 * 获取新窗口名称
 * @param pathname
 * @returns {*}
 */
export const getTargetName = function (pathname = location.pathname) {
    return md5(pathname);
};

/**
 * 获取字典某个值
 * @param dict
 * @param itemCode
 * @returns {*|string}
 */
export const getDictValue = function (dict = [], itemCode) {
    let item = find(dict, {itemCode});
    return item && item.itemValue;
};

/**
 * 获取字典键值对数据
 * @param dict
 * @returns {*}
 */
export const getDictItems = function (dict = []) {
    return dict.reduce((result, item) => {
        item.itemCode && (result[item.itemCode] = item.itemValue);
        return result;
    }, {})
};

/**
 * 从APP列表中整理出键值对集合
 * @param apps
 * @returns {*|{}}
 */
export const getAppSet = function (apps = []) {
    return apps.reduce((result, item, index) => {
        result[item.appId] = item.appIdDis;
        return result;
    }, {});
};

/**
 * 解析hbase数据结构- xx:ssss;bb:kkkkk;cc:ddddd;dd:wwwww
 * @param param
 * @returns {JSON Object}
 */
export const stringToJson = function (strParam) {
    if (!isString(strParam)) return {};
    return fromPairs(compact(strParam.split(";")).map((str) => {
        let arr = str.split(':');
        isEmpty(arr[1]) && (arr[1] = null);
        return arr;
    }));
};

/**
 * 获取百分数
 * @param molecule 分子
 * @param denominator 分母
 * @param precision 保留位数
 * @returns {number}
 */
export const getPercentage = function (molecule = 0, denominator = 1, precision = 0) {
    return Math.round((molecule / denominator) * 100 * Math.pow(10, precision)) / Math.pow(10, precision) || 0
};

/**
 * 获取表单错误信息列表
 * @param errors antd表单错误返回信息
 * @returns {array}
 */
export const getFormErrorMsgs = function (errors = {}) {
    return isEmpty(errors) ? []
        :
        values(errors).reduce(
            (result, item, index) => result.concat(item.errors.map(err => err.message)),
            []
        );
};

/**
 * 获取表单第一条错误信息
 * @param errors antd表单错误返回信息
 * @returns {string}
 */
export const getFormFirstErrorMsg = function (errors = {}) {
    let msg = '';
    (function foo(errors) {
        if (isEmpty(errors)) return;
        let item = values(errors);
        // console.warn(item);
        if (item[0] && isArray(item[0].errors)) {
            msg = item[0].errors[0].message;
        } else {
            foo(compact(values(item))[0]);
        }
    })(errors);
    return msg;
};


/**
 * 是否匹配react路由
 * @param url
 * @param pathname
 * @returns {*}
 */
export const matchPathname = function (url, pathname) {
    let option = {
        exact: false,
        strict: false
    };
    if (isString(pathname)) {
        option.path = pathname
    } else if (isPlainObject(pathname)) {
        Object.assign(option, pathname);
    } else {
        return false;
    }
    return matchPath(url, option);
};


/**
 * 获取权限码
 * @param admin
 * @param location
 * @returns {{read: boolean, write: boolean}}
 */
export const getPermission = function ({admin}, {location}) {
    let permissions = admin.permissions;
    let permission = {
        read: false,
        write: false
    };

    if (readAllowed(permissions)) permission.read = true;
    if (writeAllowed(permissions)) permission.write = true;

    return permission;
};

/**
 * 判断是否拥有读权限
 * @param permissions
 * @returns {boolean}
 */
export const readAllowed = function (permissions) {
    return (
        sessionStorage._currCode === 'empty' ||
        permissions.indexOf(`${getCurrCode()}.read`) > -1
    );
};

/**
 * 判断是否拥有写权限
 * @param permissions
 * @returns {boolean}
 */
export const writeAllowed = function (permissions) {
    return permissions.indexOf(`${getCurrCode()}.write`) > -1;
};

/**
 * 获取当前菜单权限码
 * @returns {string | null}
 */
export const getCurrCode = function () {
    return sessionStorage.getItem('_currCode');
};

/**
 * 去掉对象中所有字符串型键值的前后空格
 * @param obj 传入对吸纳个
 * @returns {{}} 返回一个新的对象
 */
export const trimObjectValues = function (obj) {
    if (isPlainObject(obj)) { // 确保是Json型对象
        let newObj = {};
        keys(obj).forEach((k) => {
            newObj[k] = isString(obj[k]) ? trim(obj[k]) : obj[k];
        });
        return newObj;
    }
    return obj;
};

/**
 * 获取地址查询参数
 * @param location
 * @returns {*}
 */
export const getLocationQuery = function (location = window.location) {
    return parse(location.search.replace(/^\?/, ''));
};

/**
 * 阻止冒泡
 * @param e
 */
export const stopPropagation = function (e) {
    e.stopPropagation();
    if (e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
    }
};
/**
 * 获取字符串拼音列表
 * @param str
 * @param option
 * @returns {*}
 */
export const getPinyin = function (str, option = {
    pinyinOnly: false
}) {
    return pinyin(str, option);
};
/**
 * 获取拼音字符串
 * @param str
 */
export const getPinyinStr = function (str) {
    return getPinyin(str).join('');
};

/**
 * 深度遍历对象，将布尔值转换0或1
 * @param obj
 * @returns {{} || []}
 */
export const objectTransBool = function (obj = {}) {
    for (let k in obj) {
        let v = obj[k];
        if (isArray(v) || isPlainObject(v)) {
            objectTransBool(v);
        } else if (isBoolean(v)) {
            obj[k] = v ? 1 : 0;
        }
    }
    return obj;
};

/**
 * 深冻结函数
 * @param o
 * @returns {ReadonlyArray<any>}
 */
export const deepFreeze = function (o) {
    // 取回定义在obj上的属性名
    let propNames = Object.getOwnPropertyNames(o);
    // 在冻结自身之前冻结属性
    propNames.forEach((name) => {
        let prop = o[name];
        // 如果prop是个对象，冻结它
        if (typeof prop === 'object' && prop !== null)
            deepFreeze(prop);
    });

    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj);
};

/**
 * 获取视图DOM节点
 * @returns {HTMLElement | null}
 */
export const getViewport = function() {
    return document.getElementById('viewport');
};

/**
 * 解析url
 * @param url
 * @returns {*}
 */
export const parseUrl = function(url) {
    let a = document.createElement('a');
    a.href = url;
    return pick(a, ['href', 'protocol', 'host', 'hostname', 'pathname', 'port', 'search', 'hash']);
};

/**
 * 空函数
 */
export const noop = () => {
};

export {connect, bindActionCreators, propTypes, classnames, jquery, moment, md5, inject};
