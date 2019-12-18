import {
    UPDATE_READED_LIST,
    UPDATE_UNREAD_LIST,
    UPDATE_UNREADS_TO_READEDS,
    DROP_UNREADS_AND_READEDS
} from 'constants/message';

import {get, uniqBy, orderBy, pullAll} from 'lodash';

const initialState = Object.freeze({
    readedTotal: 0,
    readeds: Object.freeze([]),
    unreadTotal: 0,
    unreads: Object.freeze([])
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_READED_LIST: {
            let readeds = orderBy( // 按时间降序
                uniqBy( // 数据去重
                    [...state.readeds].concat(get(action.payload, 'list') || []),
                    'id'
                ),
                ['updateTime'],
                ['desc']
            );

            return Object.freeze({
                ...state,
                readeds: Object.freeze(readeds),
                readedTotal: get(action.payload, 'totalCount') || state.readedTotal
            });
        }
        case UPDATE_UNREAD_LIST: {
            let unreads = orderBy( // 按时间降序
                uniqBy(
                    [...state.unreads].concat(get(action.payload, 'list') || []).filter(item => !item.ifCheck), // 合并数据，并过滤已读数据
                    'id'
                ), // 合并数据并去重
                ['updateTime'],
                ['desc']
            );

            return Object.freeze({
                ...state,
                unreads: Object.freeze(unreads),
                unreadTotal: get(action.payload, 'totalCount') || state.unreadTotal
            });
        }
        case UPDATE_UNREADS_TO_READEDS: {
            let unreads = [...state.unreads];
            let changed = unreads.filter((item) => action.payload.indexOf(item.id) > -1).map((item) => {
                item.ifCheck = 1;
                return item;
            });
            let readeds = orderBy( // 按时间降序
                [...state.readeds, ...changed],
                ['updateTime'],
                ['desc']
            );
            return Object.freeze({
                ...state,
                unreads: Object.freeze(unreads),
                unreadTotal: state.unreadTotal - changed.length,
                readeds: Object.freeze(readeds),
                readedTotal: state.readedTotal + changed.length
            });
        }
        case DROP_UNREADS_AND_READEDS: {
            let unreads = [...state.unreads];
            let readeds = [...state.readeds];
            let willDeleteUnreads = unreads.filter(item => action.payload.indexOf(item.id) > -1);
            let willDeleteReadeds = readeds.filter(item => action.payload.indexOf(item.id) > -1);
            pullAll(unreads, willDeleteUnreads);
            pullAll(readeds, willDeleteReadeds);
            return Object.freeze({
                ...state,
                unreads: Object.freeze(unreads),
                unreadTotal: state.unreadTotal - willDeleteUnreads.filter(item => !item.ifCheck).length,
                readeds: Object.freeze(readeds),
                readedTotal: state.readedTotal - willDeleteReadeds.length
            });
        }
        default: {
            return state;
        }
    }
};

