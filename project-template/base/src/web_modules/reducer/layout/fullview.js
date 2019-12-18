import { OPEN_FULLVIEW, CLOSE_FULLVIEW, TOGGLE_FULLVIEW } from 'constants/layout';

const fullscreen = (state = false, action) => {
    switch(action.type) {
        case OPEN_FULLVIEW:
            return true;
        case CLOSE_FULLVIEW:
            return false;
        case TOGGLE_FULLVIEW:
            return !state;
        default:
            return state;
    }
};

export default fullscreen;
