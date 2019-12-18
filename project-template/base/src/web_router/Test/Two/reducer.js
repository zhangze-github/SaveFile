import { ADD_CUNT, JIAN_COUNT } from './constant';

const initialData = {
    test3: 1,
    test:2,
    test2: 3
};

export default{
    name: 'two',
    fun :(state = initialData, action) => {
    switch (action.type) {
        case ADD_CUNT: {
            return {
                ...state,
                test3: action.payload + 1,
            }
        }
        case JIAN_COUNT:
            return {
                ...state,
                test3: action.payload - 1,
            }
        default:
            return state;
    }
}
}