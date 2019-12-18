import { OPEN_SIDEBAR, CLOSE_SIDEBAR, TOGGLE_SIDEBAR } from 'constants/layout';

const collapseStatus = 'off';
const expandStatus = 'on';

let initialState = sessionStorage.getItem('_sidebarStatus') === collapseStatus;

const sidebar = (state = initialState, action) => {
    switch(action.type) {
        case OPEN_SIDEBAR:{
            sessionStorage.setItem('_sidebarStatus', expandStatus);
            return false;
        }
        case CLOSE_SIDEBAR:{
            sessionStorage.setItem('_sidebarStatus', collapseStatus);
            return true;
        }
        case TOGGLE_SIDEBAR:{
            let collapsed = !state;
            sessionStorage.setItem('_sidebarStatus', collapsed ? collapseStatus : expandStatus);
            return collapsed;
        }
        default:
            return state;
    }
};

export default sidebar;
