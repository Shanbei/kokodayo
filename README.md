## 启动项目
const koko = new Kokodayo(config);
koko.run(port);
## config配置介绍
post数据解析[基于 koa-body]
config = {
    fileUpload: 是否开启文件上传 默认为true [基于 koa-body]
    fileLimit: 文件上传大小限制 默认设置为 '50mb' [基于 koa-body]
    port: 启动端口 默认3107 
    history: 前端静态页面历史模式是否开启vue/react 默认为true，hash模式需要传false [基于 koa-connect-history-api-fallback]
    redis: radis配置，默认关闭 [基于 redis]
    staticView: 前端静态文件路径 默认为空，不起用前端模板渲染 [基于 koa-static]
    log: 日志是否开启，默认为true
}
## 路由配置 [基于 koa-router]
const { router } = koko;
router.get('/ping', async function (ctx, next) {
    return 'ping ok';
});
## sql配置 [基于 sequelize]
const db = koko.sql('databaseName', 'mysql://account:password@localhost:3306/database')
const model = (sequelize, DataTypes) => sequelize.define('tableName', {
	Aid: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
    	primaryKey: true
	  },
	id: {
	  type: DataTypes.INTEGER.UNSIGNED,
	  allowNull: true
	},
	title: {
	  type: DataTypes.STRING,
	},
	context:{
		type: DataTypes.STRING,
		allowNull: true
	}
  }, {})
db.model(model)