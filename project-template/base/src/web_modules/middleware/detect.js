export default store => next => action => {
    if(action) next(action);
    else console.error(`action is`, JSON.stringify(action));
}
