import {SET_CUSTOM_EVENTS} from 'constants/cache';
import {isArray} from 'lodash';

const initialState = Object.freeze([]);

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CUSTOM_EVENTS: {
            return isArray(action.payload) ? Object.freeze([...action.payload]) : state;
        }
        default: {
            return state;
        }
    }
}
