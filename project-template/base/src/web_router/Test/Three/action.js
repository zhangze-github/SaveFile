



import {ADD_CUNT, JIAN_COUNT, SET_BASE_APP} from './constant';
import {get, post} from 'actions/http';

export const addCount = (data = {}) => ({type: ADD_CUNT, payload: data});

export const jianCount  = (data = {}) => ({type: JIAN_COUNT, payload: data});

export const httpReq = (params = {}) => {
    return post("http://zeze.work/test", params, setBaseApp(), 'getBaseAppList');
};

export const setBaseApp = (data = {}) => ({type: SET_BASE_APP, payload: data});