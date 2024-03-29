const { Sequelize, DataTypes } = require('sequelize');
class SqlModel {
	constructor() {
		this.sqlMap = new Map();
	}
	create(name, key, option) {
		const sequelize = new Sequelize(key, option);
		const item = { sequelize, models: {} }
		this.sqlMap.set(name, item);
		return this.model.bind(this, item);
	}
	model({ sequelize, models }, buildModel) {
		const model = buildModel(sequelize, DataTypes);
		models[model.name] = model;
	}
	build() {
		const { sqlMap } = this;
		const sqlKeys = sqlMap.keys();
		const sqlModels = {};
		for (const name of sqlKeys) {
			const { sequelize, models } = sqlMap.get(name);
			sequelize.sync({alter: true});
			sqlModels[name] = models;
		}
		return async function (ctx, next) {
			ctx.sql = sqlModels;
			await next();
		}
	}
}
module.exports = SqlModel;