import {
    OPEN_FULLVIEW,
    CLOSE_FULLVIEW,
    TOGGLE_FULLVIEW,

    OPEN_SIDEBAR,
    CLOSE_SIDEBAR,
    TOGGLE_SIDEBAR,

    OPEN_PRODUCTS,
    CLOSE_PRODUCTS,
    TOGGLE_PRODUCTS,

    OPEN_FEEDBACK,
    CLOSE_FEEDBACK,
    FEEDBACK_LOADING,
    FEEDBACK_LOADED,

    SET_SIDEBAR_PRODUCT,
    SET_SIDEBAR_MENUS,

    // SET_VIEWPORT_SIZE
    SET_VIEWPORT,
    VIEWPORT_SCROLL_TO_TOP,
    VIEWPORT_SCROLL_TO_BOTTOM
} from 'constants/layout';
import {noop} from 'utils';
import {get, post} from 'actions/http';
import {message} from 'bqs';

// 隐藏顶部工具条和侧边菜单
export const openFullview = () => ({type: OPEN_FULLVIEW});

// 显示顶部工具条和侧边菜单
export const closeFullview = () => ({type: CLOSE_FULLVIEW});

export const toggleFullview = () => ({type: TOGGLE_FULLVIEW});

// 显示侧边菜单
export const openSidebar = () => ({type: OPEN_SIDEBAR});

// 隐藏侧边菜单
export const closeSidebar = () => ({type: CLOSE_SIDEBAR});

export const toggleSidebar = () => ({type: TOGGLE_SIDEBAR});

// 打开产品列表
export const openProducts = () => ({type: OPEN_PRODUCTS});

// 关闭产品列表
export const closeProducts = () => ({type: CLOSE_PRODUCTS});

export const toggleProducts = () => ({type: TOGGLE_PRODUCTS});

// 用户反馈
export const submitFeedback = (data = {}, cb = noop) => {
    return post('/ams/infomanage/submitData.json', {
        params: JSON.stringify(data)
    }, [
        feedbackLoading(),
        (data, dispatch, getState) => {
            cb();
            dispatch(closeFeedback());
        },
        null,
        feedbackLoaded()
    ], 'submitFeedback');
};

export const feedbackLoading = () => ({type: FEEDBACK_LOADING});
export const feedbackLoaded = () => ({type: FEEDBACK_LOADED});
// 打开意见反馈Modal
export const openFeedback = () => ({type: OPEN_FEEDBACK});
// 关闭意见反馈Modal
export const closeFeedback = () => ({type: CLOSE_FEEDBACK});

// export const setViewportSize = (size = {widht: 0, height: 0}) => ({type: SET_VIEWPORT_SIZE, payload: size});
export const setViewport = (ele) => ({type: SET_VIEWPORT, payload: ele});
// 滚动到顶部
export const viewportScrollToTop = (option = {}) => ({type: VIEWPORT_SCROLL_TO_TOP, payload: option});
// 滚动到底部
export const viewportScrollToBottom = (option = {}) => ({type: VIEWPORT_SCROLL_TO_BOTTOM, payload: option});
// 设置侧边栏产品
export const setSidebarProduct = (product = {}) => ({type: SET_SIDEBAR_PRODUCT, payload: product});
// 设置侧边栏菜单
export const setSidebarMenus = (menus = []) => ({type: SET_SIDEBAR_MENUS, payload: menus});


