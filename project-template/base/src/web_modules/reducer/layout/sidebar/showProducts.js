import {OPEN_PRODUCTS, CLOSE_PRODUCTS, TOGGLE_PRODUCTS} from 'constants/layout';

export default (state = false, action) => {
    switch (action.type) {
        case OPEN_PRODUCTS:
            return true;
        case CLOSE_PRODUCTS:
            return false;
        case TOGGLE_PRODUCTS:
            return !state;
        default:
            return state;
    }
};

