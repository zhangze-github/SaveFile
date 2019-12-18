import {OPEN_FEEDBACK, CLOSE_FEEDBACK, FEEDBACK_LOADING, FEEDBACK_LOADED} from 'constants/layout';

const initialState = Object.freeze({
    visible: false,
    loading: false
});
const fullscreen = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_FEEDBACK:
            return Object.freeze({
                ...state,
                visible: true
            });
        case CLOSE_FEEDBACK:
            return Object.freeze({
                ...state,
                visible: false,
                loading: false
            });
        case FEEDBACK_LOADING:
            return Object.freeze({
                ...state,
                loading: true
            });
        case FEEDBACK_LOADED:
            return Object.freeze({
                ...state,
                loading: false
            });
        default: {
            return state;
        }
    }
};

export default fullscreen;
