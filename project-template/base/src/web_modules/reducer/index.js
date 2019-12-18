import {combineReducers} from 'redux';
import http from './http';
import layout from './layout';
import cache from './cache';
import admin from './admin';
import message from './message';

export function createReducer(asyncReducers) {
    return combineReducers({
        ...asyncReducers,
        http,
        admin,
        cache,
        layout,
        message
    });
}

export function injectAsyncReducer(store, name, asyncReducer) {
    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
}


