module.exports = function (func) {
    return async (ctx, next) => {
        const res = await func(ctx);
        if (res === undefined) {
            await next();
            return;
        }
        const resType = typeof res;
        if (resType === 'object' && !Array.isArray(res)) {
            ctx.send(res);
            return;
        }
        ctx.send({
            success: true,
            data: res
        });
        return;
    }
}