const jsonFormat = require('./jsonFormat');
const groupArg = arg => {
    let fullPath = '';
    for (const path of arg) {
        fullPath += path;
    }
    return fullPath;
}
const routerBind = function () {
    const routerFun = ['get', 'post', 'patch', 'delete'];
    const groupPath = groupArg(arguments);
    const routerMap = { router: routerBind.bind(this, ...arguments) };
    routerFun.forEach(key => {
        routerMap[key] = (path, fun) => {
            const fullPath = `${groupPath}${path}`;
            this.log(`router:[${key}]`, fullPath);
            return this.koaRouter[key](fullPath, jsonFormat(fun))
        }
    });
    return routerMap;
}
module.exports = routerBind