import { combineReducers } from 'redux';
import dict from './dict';
import customEvents from './customEvents';

const reducers = combineReducers({
    dict,
    customEvents
});

export default reducers;
