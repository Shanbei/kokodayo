const Koa = require('koa');
const koaHistory = require('koa-connect-history-api-fallback'); // 单页面web开启history模式
const koaStatic = require('koa-static');
const koaRouter = require('koa-router');
const koaBody = require('koa-body');
const ctxBind = require('./bin/ctxBind.js');
const path = require('path');
const SqlModel = require('./bin/sql');
const jsonFormat = require('./bin/jsonFormat');
class Kokodayo extends Koa {
	constructor(props) {
		super();
		this.config = {
			fileUpload: true, // 是否开启文件上传
			fileLimit: '50mb', // 默认文件上传大小限制
			port: 3107, // 默认端口
			history: true, // 是否开启视图历史模式
			staticView: '', // 前端静态文件路径
			log: true, // 日志打开
			...props,
		}
		// this = new Koa();
		this.serverMap = new Map();
		this.sqlModel = new SqlModel();
		this.koaRouter = new koaRouter();
		const { fileUpload, fileLimit } = this.config;
		if (fileUpload && fileLimit) {
			this.use(koaBody({
				multipart: true,
				formLimit: fileLimit,
				jsonLimit: fileLimit,
				textLimit: fileLimit,
			}))
		}
		this.use(ctxBind())
	}
	log() {
		const { log } = this.config;
		if (log) {
			console.log.apply(undefined, ['>', ...arguments]);
		}
	}
	get router() {
		const routerFun = ['get', 'post', 'patch', 'delete'];
		const routerMap = {};
		routerFun.forEach(key => {
			routerMap[key] = (path, fun) => {
				this.log(`router:[${key}]`, path);
				return this.koaRouter[key](path, jsonFormat(fun))
			}
		});
		return routerMap;
	}
	sql = (modelName, key) => {
		return this.sqlModel.create(modelName, key, { logging: this.config.log });
	}
	sqlbind = () => {
		this.use(this.sqlModel.build());
	}
	close(port) {
		if (port === undefined) {
			const servers = this.serverMap.values();
			servers.forEach(server => server.close());
			return;
		}
		if (this.serverMap.has(port)){
			const server = this.serverMap.get(port);
			server.close();
			this.serverMap.delete(port);
			return;
		}
	}
	exit() {
		this.close();
		process.exit(0);
	}
	run(port = this.config.port) {
		const { history, staticView } = this.config;
		this.use(this.koaRouter.routes())
		if (staticView !== '') {
			history && this.use(koaHistory());
			this.use(koaStatic(path.join(__dirname, staticView)))
		}
		const server = this.listen(port, () => {
			this.log(`listen: ${port}`)
		});
		this.serverMap.set(port, server);
	}
}
const kokodayo = new Kokodayo({port: 3222});
const { router } = kokodayo;
router.get('/ping', async (ctx, next) => {
	return 'ping ok';
})
// const sqlModel = kokodayo.sql('roly', 'mysql://root:pwd@127.0.0.1:3306/database');
// sqlModel(examples);
// kokodayo.sqlbind();
kokodayo.run();
module.exports = Kokodayo;