const { createClient } = require('redis');
// client.on('error', (err) => console.log('Redis Client Error', err));
class Redis {
    constructor(options){
        let config = undefined;
        switch (typeof options) {
            case 'object':
                config = options;
                break;
            case 'string':
                config = {
                    url: options
                };
                break;
            default:
                config = undefined;
        }
        try {
            this.client = createClient();
        } catch (err) {
            console.error('redis error:', err);
        }
        
    }
    async connect() {
        try {
            await this.client.ping();
        } catch {
            await this.client.connect();
        }
        return this.client;
    }
    async getRedis(key) {
        await this.connect();
        return await this.client.get(key);
    }
    async setRedis(key, value) {
        await this.connect();
        return await this.client.set(key, value);
    }
    redisBind() {
        const that = this;
        const { getRedis, setRedis } = that;
        return async (ctx, next) => {
            ctx.redis = {
                get: getRedis.bind(that),
                set: setRedis.bind(that)
            };
            await next();
        }
    }
}
module.exports = Redis;