import {SET_VIEWPORT, VIEWPORT_SCROLL_TO_TOP, VIEWPORT_SCROLL_TO_BOTTOM} from 'constants/layout';
import $ from 'jquery';

const initState = null;
export default (state = initState, action) => {
    switch (action.type) {
        case SET_VIEWPORT: {
            return action.payload;
        }
        case VIEWPORT_SCROLL_TO_TOP: {
            let $viewport = $(state);
            window.requestAnimationFrame(() => {
                let distance = $viewport.children().height() - $viewport.height();
                $viewport.animate({scrollTop: 0}, action.payload || (distance > 1000 ? 1000 : distance));
            });
            // .scrollTop(0);
            return state;
        }
        case VIEWPORT_SCROLL_TO_BOTTOM: {
            let $viewport = $(state);
            window.requestAnimationFrame(() => {
                let distance = $viewport.children().height() - $viewport.height();
                $viewport.animate({scrollTop: distance + 100}, action.payload || (distance > 1000 ? 1000 : distance));
            });
            // .scrollTop(Number.MAX_SAFE_INTEGER);
            return state;
        }
        default:
            return state;
    }
};
