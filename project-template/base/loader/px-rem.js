module.exports = function (src) {    
    if (src) {
        src = src.replace(/((\d)+(\.\d+)?)+(px)/gi, (str, str1) => {
            return  parseFloat(str1) / 37.5 + 'rem';
        })
    }
    return src;
}