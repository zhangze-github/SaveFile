import { combineReducers } from 'redux';
import sidebar from './sidebar/';
import fullview from './fullview';
import viewport from './viewport';
import feedback from './feedback';

const reducers = combineReducers({
    sidebar,
    viewport,
    fullview,
    feedback
});

export default reducers;
