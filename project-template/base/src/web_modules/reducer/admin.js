import {
    SET_ADMIN_INFO,
    SET_ADMIN_PRODUCT_SELECTED,
    SET_ADMIN_PRODUCTS_MENU,
    SET_ADMIN_PRODUCTS,
    SET_ADMIN_APPS,
    SET_ADMIN_APP_SELECTED,
    SET_ADMIN_PERMISSIONS
} from 'constants/admin';
import {cloneDeep, groupBy, set, forEach, sortBy, defaultTo, get} from 'lodash';

const initialState = Object.freeze({
    info: Object.freeze({}),
    productsMenu: Object.freeze({}),
    products: Object.freeze([]),
    productSelected: '',
    permissions: Object.freeze([]),
    apps: Object.freeze([]),
    appSelected: ''
});
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ADMIN_PRODUCTS_MENU: {
            return Object.freeze({
                ...state,
                productsMenu: Object.freeze(action.payload || {})
            });
        }
        case SET_ADMIN_INFO: {
            return Object.freeze({
                ...state,
                info: Object.freeze(action.payload || {})
            });
        }
        case SET_ADMIN_PRODUCTS: {
            return Object.freeze({
                ...state,
                products: Object.freeze(action.payload || [])
            });
        }
        case SET_ADMIN_PRODUCT_SELECTED: {
            return Object.freeze({
                ...state,
                productSelected: action.payload || ''
            });
        }
        case SET_ADMIN_APPS: {
            return Object.freeze({
                ...state,
                apps: Object.freeze(action.payload || [])
            });
        }
        case SET_ADMIN_PERMISSIONS: {
            return Object.freeze({
                ...state,
                permissions: Object.freeze(action.payload || [])
            });
        }
        case SET_ADMIN_APP_SELECTED: {
            let appSelected = action.payload || '';
            localStorage.setItem('_lastAppId', appSelected);
            return Object.freeze({
                ...state,
                appSelected
            });
        }
        default: {
            return state;
        }
    }
}
