var DataTypes = require('sequelize').DataTypes
var _customers = require('./customers')
var _delivery_orders = require('./delivery_orders')
var _invoice = require('./invoice')
var _products = require('./products')
var _upload_log = require('./upload_log')
var _user = require('./user')
var _roles = require('./roles')
var _userRoles = require('./user_roles')

function initModels(sequelize) {
	var customers = _customers(sequelize, DataTypes)
	var delivery_orders = _delivery_orders(sequelize, DataTypes)
	var invoice = _invoice(sequelize, DataTypes)
	var products = _products(sequelize, DataTypes)
	var upload_log = _upload_log(sequelize, DataTypes)
	var user = _user(sequelize, DataTypes)
	var roles = _roles(sequelize, DataTypes)
	var user_roles = _userRoles(sequelize, DataTypes)

	user.belongsToMany(roles, {as:'roles', through: user_roles, foreignKey:'id_user'})
	roles.belongsToMany(user, {as:'user', through: user_roles,  foreignKey:'roleId'})

	return {
		customers,
		delivery_orders,
		invoice,
		products,
		upload_log,
		user,
		roles,
		user_roles
	}
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
