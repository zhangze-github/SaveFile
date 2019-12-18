import {
    UPDATE_READED_LIST,
    UPDATE_UNREAD_LIST,
    UPDATE_UNREADS_TO_READEDS,
    DROP_UNREADS_AND_READEDS
} from 'constants/message';
import {get, post} from 'actions/http';

export const getUnreadList = (params = {
    start: 0,
    length: 10
}) => {
    return get('/ams/infomanage/getInfo.json', {
        ...params,
        flag: 'unreadinfo'
    }, updateUnreadList(), 'getUnreadList');
};

export const updateUnreadList = () => ({type: UPDATE_UNREAD_LIST});

export const getReadedList = (params = {
    start: 0,
    length: 10
}) => {
    return get('/ams/infomanage/getInfo.json', {
        ...params,
        flag: 'readinfo'
    }, updateReadedList(), 'getReadedList');
};

export const updateReadedList = () => ({type: UPDATE_READED_LIST});

export const updateUnreadsToReadeds = (ids = []) => ({type: UPDATE_UNREADS_TO_READEDS, payload: ids});

export const dropUnreadsAndReadeds = (ids = []) => ({type: DROP_UNREADS_AND_READEDS, payload: ids});

