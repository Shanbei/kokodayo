const lodash = require('lodash');
const struct = require('./struct');
const proxy = require('./httpProxy');
const { get } = lodash;
module.exports = function() {
	function renderJson(json){
		this.set('Content-Type', 'application/json');
		try {	
			this.body = JSON.stringify(json);
		} catch {
			this.status = 500;
			this.body = JSON.stringify({
				message: '服务器内部错误'
			})
		}
	}
	function getParams(items) {
		const params = this.method === 'GET' ? this.request.query : this.request.body;
		const _items = {}
		Object.keys(items).forEach(key=>{
			_items[key] = get(params, key, items[key])
		})
		return _items;
	}
	return async function(ctx, next) {
		ctx.send = renderJson.bind(ctx);
		ctx.getParams = getParams.bind(ctx);
		ctx.struct = struct;
		ctx.proxy = proxy.bind(ctx);
		await next()
	}
}