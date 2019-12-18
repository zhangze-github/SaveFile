import {createStore, applyMiddleware, compose} from 'redux';
// import thunk from 'redux-thunk';
import logger, {createLogger} from 'redux-logger';
import crashReporter from 'middleware/crashReporter';
import http from 'middleware/http';
import nextAction from 'middleware/nextAction';
import detect from 'middleware/detect';
import {createReducer} from 'reducer';
import {get} from 'lodash';
import thunk from './middleware/thunk';
import {HTTP_SUCCESS, HTTP_ERROR, HTTP_COMPELETE} from 'constants/http';

let middleware, composeEnhancers;

// if (__DEV__) {
if(true){
    if(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        // if(false) {
        middleware = [detect, logger, thunk, http, nextAction];
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    } else {
        let logger = createLogger({
            collapsed: (getState, action) => [HTTP_SUCCESS, HTTP_ERROR, HTTP_COMPELETE, undefined].indexOf(action.type) > -1,
            titleFormatter: (action, time, took) => {
                let type = get(action, 'type', action.types ? `HTTP_${action.options.type}` : typeof action);
                let str = `action [${type}] @ ${time} (in ${took.toFixed(2)} ms)`;
                return str;
            }
        });
        middleware = [detect, logger, thunk, http, nextAction];
        composeEnhancers = compose;
    }
} else {
    middleware = [crashReporter, thunk, http, nextAction];
    composeEnhancers = compose;
    // enhancer = applyMiddleware(...middleware)
}
let enhancer = composeEnhancers(
    applyMiddleware(...middleware)
);


export default function createStoreWithMiddleware(initialState) {
    const store = createStore(createReducer(), initialState, enhancer);
    store.asyncReducers = {};
    return store
}
