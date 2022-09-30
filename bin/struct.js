module.exports = function(struct){
    Object.values(struct).forEach(function(structType){
        if (typeof structType !== 'function'){
            throw new Error('struct parameter error')
        }
    });
    return items => {
        Object.keys(items).forEach(key=>{
            const structType = struct[key];
            if (structType && items[key].constructor !== structType) {
                items[key] = structType(items[key]);
            }
        });
        return items;
    }
}