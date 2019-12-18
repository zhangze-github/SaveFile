/**
 * 格式化JSON对象，并缩进4字符
 * @param obj
 * @returns {*}
 */
exports.toJson = function(obj) {
    try {
        return JSON.stringify(obj, null, 4);
    } catch (err) {
        return obj;
    }
};
