import {isArray, isString, isFunction, last} from 'lodash';
import {SET_DICT, SET_CUSTOM_EVENTS} from 'constants/cache';
import {get} from 'actions/http';
import {noop} from 'utils';

export const getDict = (...list) => (dispatch, getState) => {
    let codes = [];
    let dict = getState().cache.dict;
    let cb = noop;

    if (isArray(list[0])) {
        codes = list[0].filter((code) => isString(code) && Object.keys(dict).indexOf(code) === -1);
        cb = isFunction(list[1]) ? list[1] : noop;
    } else {
        codes = list.filter((code) => isString(code) && Object.keys(dict).indexOf(code) === -1);
        cb = isFunction(last[list]) ? last[list] : noop;
    }
    codes.length > 0 && dispatch(
        get(getUri('dict/listItemArray.json'), {codes}, (result, dispatch, getState) => {
            dispatch(setDict(result.payload));
            cb();
        })
    );
};

export const updateDict = (...list) => (dispatch, getState) => {
    let codes = [];

    if (isArray(list[0])) codes = list[0];
    else codes = list;

    if (codes.length === 0) {
        let dict = getState().cache.dict;
        codes = Object.keys(dict);
    }

    codes.length > 0 && dispatch(
        get(getUri('dict/listItemArray.json'), {codes}, setDict())
    );
};

export const setDict = (data = {}) => ({type: SET_DICT, payload: data});

export const getCustomEvents = (force = false) => (dispatch, getState) => {
    if (force || getState().cache.customEvents.length === 0) {
        dispatch(get(getUri('dict/customEventList.json'), {}, setCustomEvents()));
    }
};

export const setCustomEvents = () => ({type: SET_CUSTOM_EVENTS});

function getUri(path) {
    switch(__LAYOUT__) {
        case 'portal': {
            return `/ams/${path}`;
        }
        case 'console': {
            return `/bms/${path}`;
        }
        default: {
            return `/ams/${path}`;
        }
    };
}
