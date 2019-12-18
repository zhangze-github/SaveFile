import {SET_SIDEBAR_MENUS} from 'constants/layout';

const menus = (state = [], action) => {
    switch(action.type) {
        case SET_SIDEBAR_MENUS: {
            return action.payload;
        }
        default:
            return state;
    }
};

export default menus;
