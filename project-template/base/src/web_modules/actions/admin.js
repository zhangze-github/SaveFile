import {
    SET_ADMIN_INFO,
    SET_ADMIN_PRODUCT_SELECTED,
    // SET_ADMIN_SOURCE_INFO,
    SET_ADMIN_PRODUCTS_MENU,
    SET_ADMIN_PRODUCTS,
    SET_ADMIN_APPS,
    SET_ADMIN_APP_SELECTED,
    SET_ADMIN_PERMISSIONS
} from 'constants/admin';
import {get, post, postJson} from 'actions/http';
import {setSidebarMenus, setSidebarProduct} from 'actions/layout';
import {noop} from 'utils';
import {cloneDeep, groupBy, set, forEach, sortBy, defaultTo, pick, find} from 'lodash';
import $ from 'jquery';
import {message} from 'bqs';

// export const setAdminSourceInfo = () => {
//     return {
//         type: SET_ADMIN_SOURCE_INFO,
//         nextAction: (dispatch, getState) => {
//             $("#root").removeClass("queue");
//             // $("#rootLoading").fadeOut(1000, function () {
//             //     $(this).remove();
//             // });
//
//             let _info = getState().admin._info;
//             let sdata = _info.sdata;
//             // console.log(sdata);
//
//             let productsMenu = getMenus(sdata.userMenuList);
//             let products = sdata.userProductList || [];
//             let productSelected = sdata.userProductTypeSelected || products[0].type;
//             let product = find(products, {type: productSelected}) || {};
//             let apps = sdata.userAppList || [];
//             let lastAppId = localStorage.getItem('_lastAppId');
//
//             // 第一次加载时，判断当前路径产品是否对应返回产品，如果不对应，则更新到对应产品
//             sdata.userMenuList.filter(menu => !!menu.isLeaf).some((menu) => {
//                 if(window.location.pathname === menu.url && menu.productType !== productSelected) {
//                     product = find(products, {type: menu.productType}) || product;
//                     dispatch(changeProduct(product));
//                     return true;
//                 }
//             });
//
//             dispatch(setSidebarProduct(product));
//
//             dispatch(setSidebarMenus(productsMenu[product.type]));
//
//             dispatch(setAdminProductSelected(productSelected));
//
//             dispatch(setAdminPermissions(sdata.userSelectAppPermission));
//
//             dispatch(setAdminProducts(products));
//
//             dispatch(setAdminApps(apps));
//
//             dispatch(setAdminAppSelected(sdata.userAppIdSelected));
//
//             dispatch(setAdminInfo({
//                 userId: sdata.userId,
//                 email: sdata.email,
//                 username: sdata.username,
//                 mobile: sdata.mobile,
//                 isAdmin: parseInt(sdata.isAdmin) === 1 ? true : false,
//                 twiceAuthOpend: parseInt(sdata.twiceAuth) === 1 ? true : false
//             }));
//
//             dispatch(setAdminProductsMenu(productsMenu));
//
//             // 获取上一次appId记录，存在则更新为上一次appId
//             if(sdata.userAppIdSelected !== lastAppId && apps.some(app => app.appId === lastAppId)) {
//                 dispatch(updateAdminAppSelected(lastAppId));
//             }
//         }
//     }
// };

export const setAdminInfo = (info) => ({
    type: SET_ADMIN_INFO,
    payload: info
});

export const setAdminProductsMenu = (productsMenu) => ({
    type: SET_ADMIN_PRODUCTS_MENU,
    payload: productsMenu
});

export const setAdminProducts = (products) => ({
    type: SET_ADMIN_PRODUCTS,
    payload: products
});

export const setAdminProductSelected = (productType) => ({
    type: SET_ADMIN_PRODUCT_SELECTED,
    payload: productType
});

export const changeProduct = (product, cb = noop) => {
    return post(getUri('usersdata/set.json'), {userProductTypeSelected: product.type}, (result, dispatch, getState) => {
        cb();
        dispatch(setAdminProductSelected(product.type));
        if (product.existApp) dispatch(updateAdminApps()); // 更新App列表
    }, true);
};

export const setAdminApps = (apps = []) => ({
    type: SET_ADMIN_APPS,
    payload: apps
});

export const setAdminPermissions = (permissions = []) => ({
    type: SET_ADMIN_PERMISSIONS,
    payload: permissions
});

export const setAdminAppSelected = (appId) => ({
    type: SET_ADMIN_APP_SELECTED,
    payload: appId
});

export const updateAdminAppSelected = (appId, resetAppSelected = noop) => {
    // console.log(appId);
    return post(getUri('usersdata/set.json'), {
        userAppIdSelected: appId,
    }, [
        null, (result, dispatch, getState) => {
            // console.log(result);
            dispatch(setAdminAppSelected(appId));
            dispatch(updateAdminAppsAndPermission())
        },
        (result, dispatch, getState) => {
            message.error('应用切换失败');
            resetAppSelected();
        }
    ], {
        preventMessage: true,
        preventCancel: true
    });
};

export const updateAdminAppsAndPermission = () => {
    return get(getUri('usersdata/get.json'), {
        sdata: ['userMenuList', 'userSelectAppPermission'].join(',')
    }, (result, dispatch, getState) => {
        let product = getState().layout.sidebar.product;
        let menus = getMenus(result.payload.sdata.userMenuList);
        let permissions = result.payload.sdata.userSelectAppPermission;
        dispatch(setAdminProductsMenu(menus));
        dispatch(setSidebarMenus(menus[product.type] || []));
        dispatch(setAdminPermissions(permissions));
    }, true);
};

export const updateAdminMenu = () => {
    return get(getUri('usersdata/get.json'), {sdata: 'userMenuList'}, (result, dispatch, getState) => {
        let menus = getMenus(result.payload.sdata.userMenuList);
        dispatch(setAdminProductsMenu(menus));
    }, true);
};

export const updateAdminApps = () => {
    return get(getUri('usersdata/get.json'), {sdata: 'userAppList,userAppIdSelected'}, (result, dispatch, getState) => {
        let sdata = result.payload.sdata;
        dispatch(setAdminApps(sdata.userAppList));
        dispatch(setAdminAppSelected(sdata.userAppIdSelected));
    }, true);
};

export const getAdminInfo = (params = {
    sdata: ['partnerId', 'userId', 'mobile', 'email', 'username', 'userMenuList', 'userAppIdSelected', 'userAppList', 'userProductList', 'userProductTypeSelected', 'twiceAuth', 'isAdmin', 'userSelectAppPermission'].join(',')
    //,cdata: ['resRoot', 'hostRoot', 'portalRoot'].join(',')
}) => {
    // return get(getUri('usersdata/get.json'), params, setAdminSourceInfo(), true);
    return get(getUri('usersdata/get.json'), params, (result, dispatch, getState) => {
        $("#root").removeClass("queue");

        let sdata = result.payload.sdata;
        // console.log(sdata);

        let productsMenu = getMenus(sdata.userMenuList);
        let products = sdata.userProductList || [];
        let productSelected = sdata.userProductTypeSelected || products[0].type;
        let product = find(products, {type: productSelected}) || {};
        let apps = sdata.userAppList || [];
        let lastAppId = localStorage.getItem('_lastAppId');

        // 第一次加载时，判断当前路径产品是否对应返回产品，如果不对应，则更新到对应产品
        sdata.userMenuList.filter(menu => !!menu.isLeaf).some((menu) => {
            if (window.location.pathname === menu.url && menu.productType !== productSelected) {
                product = find(products, {type: menu.productType}) || product;
                dispatch(changeProduct(product));
                return true;
            }
        });

        dispatch(setSidebarProduct(product));

        dispatch(setSidebarMenus(productsMenu[product.type]));

        dispatch(setAdminProductSelected(productSelected));

        dispatch(setAdminPermissions(sdata.userSelectAppPermission));

        dispatch(setAdminProducts(products));

        dispatch(setAdminApps(apps));

        dispatch(setAdminAppSelected(sdata.userAppIdSelected));

        dispatch(setAdminInfo({
            partnerId: sdata.partnerId,
            userId: sdata.userId,
            email: sdata.email,
            username: sdata.username,
            mobile: sdata.mobile,
            isAdmin: parseInt(sdata.isAdmin) === 1 ? true : false,
            twiceAuthOpend: parseInt(sdata.twiceAuth) === 1 ? true : false
        }));

        dispatch(setAdminProductsMenu(productsMenu));

        // 获取上一次appId记录，存在则更新为上一次appId
        if (sdata.userAppIdSelected !== lastAppId && apps.some(app => app.appId === lastAppId)) {
            dispatch(updateAdminAppSelected(lastAppId));
        }
    }, true);
    // return get('/api/getMenu', options, [requestSuccess() ,setMenuData(), requestError()], true);  // 等效
};

export const updateAdminInfo = (params = {}) => {
    return post(getUri('user/updateBaseinfo.json'), params, (result, dispatch, getState) => {
        let admin = getState().admin;
        let data = pick(params, ['mobile', 'username']);
        dispatch(setAdminInfo({
            ...admin.info,
            ...data
        }));
        message.success('更新成功');
    }, 'updateAdminInfo');
};

export const updateAdminPwd = (params = {}, cb = noop) => {
    return post(getUri('login/changePwdSubmit.json'), params, (result, dispatch, getState) => {
        cb();
    }, 'updateAdminPwd');
};


/**
 * 登录状态检查，登录过期默认转跳到登录页
 * @returns {{options, payload, types}}
 */
export const checkLoginStatus = (cb) => {
    return get(getUri('login/status.json'), {}, [
        null,
        (result, dispatch, getState) => cb(),
        () => window.location.reload()
    ], {
        preventCancel: true,
        preventMessage: true,
        queue: 'checkLoginStatus'
    });
};


function getMenus(userMenuList) {
    let menuData = groupBy(userMenuList, 'productType');
    // console.log(menuData);
    forEach(menuData, (menus, key) => {
        let sortData = [];
        let groupMenus = groupBy(menus, (menu) => (menu.isLeaf ? menu.parentId : menu.menuId));
        // console.log(groupMenus);
        forEach(groupMenus, (menus) => {
            // console.log(menus);
            let groupData = groupBy(menus, (menu) => menu.isLeaf === 1 ? 'sub_menu' : 'menu');
            // console.log(groupData);
            if (groupData.menu) {
                sortData.push({
                    ...groupData.menu[0],
                    sub_menu: sortBy(groupData.sub_menu, (o) => o.menuDisplayOrder)
                });
            } else {
                sortData.push({
                    sub_menu: sortBy(groupData.sub_menu, (o) => o.menuDisplayOrder)
                });
            }

        });

        menuData[key] = sortBy(sortData, (o) => o.menuDisplayOrder)

    });
    return menuData;
}

function getUri(path) {
    switch (__LAYOUT__) {
        case 'portal': {
            return `/ams/${path}`;
        }
        case 'console': {
            return `/bms/${path}`;
        }
        default: {
            return `/ams/${path}`;
        }
    }
}
