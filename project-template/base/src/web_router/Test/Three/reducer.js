
import { ADD_CUNT, JIAN_COUNT , SET_BASE_APP} from './constant';

const initialData = {
    count: 1,
    testData: []
};

export default (state = initialData, action) => {
    switch (action.type) {
        case ADD_CUNT: {
            return {
                ...state,
                count: action.payload + 1,
            }
        }
        case JIAN_COUNT:
            return {
                ...state,
                count: action.payload - 1,
            }
        case SET_BASE_APP:
            return{
                ...state,
                testData: action.xhr.statusText
            }
        default:
            return state;
    }
}
// 
// export default {
//     name: 'three',
//     fun: (state = initialData, action) => {
//     switch (action.type) {
//         case ADD_CUNT: {
//             return {
//                 ...state,
//                 count: action.payload + 1,
//             }
//         }
//         case JIAN_COUNT:
//             return {
//                 ...state,
//                 count: action.payload - 1,
//             }
//         case SET_BASE_APP:
//             return{
//                 ...state,
//                 testData: action.xhr.statusText
//             }
//         default:
//             return state;
//     }
// }
// }
