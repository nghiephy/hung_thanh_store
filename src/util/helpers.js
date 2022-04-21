
class Helper {

    
    each2(context, options) {
        var ret = "";

        for (var i = 0, j = context.length; i < j; i+=2) {
            ret = ret + options.fn(context[i]);
        }
        return ret;
    };

    eachCategories(context, options) {
        var ret = "";

        for (var i = 0, j = context.length; i < j; i+=2) {
            ret = ret + options.fn({
                firstItem: context[i],
                secondItem: context[i+1],
            });
        }
        return ret;
    };

    ifEquals(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    }
}

module.exports = new Helper();
