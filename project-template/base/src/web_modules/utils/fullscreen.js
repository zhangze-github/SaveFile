/**
 * 标准化 requestFullscreen 方法
 * @param {DOM} elem 要全屏显示的元素(webkit下只要是DOM即可，Firefox下必须是文档中的DOM元素)
 */
export function requestFullscreen( elem ) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    else if (elem.webkitRequestFullScreen) {
        // 对 Chrome 特殊处理，
        // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
        if ( window.navigator.userAgent.toUpperCase().indexOf( 'CHROME' ) >= 0 ) {
            elem.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
        }
        // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
        else {
            elem.webkitRequestFullScreen();
        }
    }
    else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    }
}

/**
 * 标准化 fullscreenElement 属性 （只读）
 * 以同名方法替代
 */
export function getFullscreenElement() {
    return document.fullscreenElement ||
        document.webkitCurrentFullScreenElement ||
        document.mozFullScreenElement ||
        null;
}


/**
 * 标准化 exitFullscreen 方法
 */
export function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}

/**
 * 标准化 fullscreen 属性 （只读）
 * 以同名方法替代
 */
export function isFullscreen() {
    return document.fullscreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        false;
}


export function fullscreenEnabled() {
    let doc = document.documentElement;
    return ( 'requestFullscreen' in doc ) ||
        ( 'webkitRequestFullScreen' in doc ) ||
        // 对Firefox除了能力判断，还加上了属性判断
        ( 'mozRequestFullScreen' in doc && document.mozFullScreenEnabled ) ||
        false;
}
