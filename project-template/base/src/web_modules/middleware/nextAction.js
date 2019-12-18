import { isString, isArray, isEmpty, isPlainObject, isFunction, omit } from 'lodash';
// import { ajax } from 'jquery';

export default store => next => action => {
    const { type, nextAction } = action;
    let result = next(action);
    if((isPlainObject(nextAction) || isFunction(nextAction)) && isString(type)) {
        // store.dispatch(omit(action, 'nextAction'));
        store.dispatch(nextAction);
    }
    return result;
};
