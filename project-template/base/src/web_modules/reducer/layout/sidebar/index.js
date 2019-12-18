import {combineReducers} from 'redux';
import showProducts from './showProducts';
import collapsed from './collapsed';
import menus from './menus';
import product from './product';

const sidebar = combineReducers({
    showProducts,
    collapsed,
    menus,
    product
});

export default sidebar;
