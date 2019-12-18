import {SET_DICT} from 'constants/cache';

const initialState = Object.freeze({});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_DICT:
            return Object.freeze({
                ...state,
                ...(action.payload || {})
            });
        default: {
            return state;
        }
    }
}
