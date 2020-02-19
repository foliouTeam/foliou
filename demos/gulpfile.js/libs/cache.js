const cache = {};
var Cache = {
    update(key, value) {
        cache[key] = value;
    },
    isSame(key, value, sync) {
        // console.log(key);
        // console.log(cache(key));
        var isSame = cache[key] == value;
        if (!!sync) {
            this.update(key, value);
        }
        return isSame;
    }
}
module.exports = Cache;
