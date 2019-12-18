import {SET_SIDEBAR_PRODUCT} from 'constants/layout';

const product = (state = {}, action) => {
    switch(action.type) {
        case SET_SIDEBAR_PRODUCT: {
            return action.payload;
        }
        default:
            return state;
    }
};

export default product;
