var DataTypes = require('sequelize').DataTypes
var _customers = require('./customers')
var _deliveryOrder= require('./deliveryOrder')
var _invoice = require('./invoice')
var _products = require('./products')
var _upload_log = require('./upload_log')
var _user = require('./user')
var _roles = require('./roles')
var _userRoles = require('./user_roles')
var _deliveryOrderItems = require('./deliveryOrderItems')

function initModels(sequelize) {
	var customers = _customers(sequelize, DataTypes)
	var deliveryOrder = _deliveryOrder(sequelize, DataTypes)
	var invoice = _invoice(sequelize, DataTypes)
	var products = _products(sequelize, DataTypes)
	var upload_log = _upload_log(sequelize, DataTypes)
	var user = _user(sequelize, DataTypes)
	var roles = _roles(sequelize, DataTypes)
	var user_roles = _userRoles(sequelize, DataTypes)
	var deliveryOrderItems = _deliveryOrderItems(sequelize, DataTypes)

	// associate user with roles
	user.belongsToMany(roles, {as:'roles', through: user_roles, foreignKey:'id_user'})
	roles.belongsToMany(user, {as:'user', through: user_roles,  foreignKey:'roleId'})

	// associate delivery_order with customers
	// deliveryOrder.belongsTo(customers, {as:'customers', foreignKey:'customer_id'})
	// customers.hasMany(deliveryOrder, {as:'deliveryOrder', foreignKey:'customer_id'})
	// deliveryOrder.belongsTo(customers, {as:'customers', foreignKey:'customer_id'})
	// customers.belongsTo(deliveryOrder, {as:'deliveryOrder',foreignKey:'customer_id'})
	// customers.belongsTo(delivery_orders, {as:'delivery_orders',foreignKey:'customer_id'})


	customers.hasMany(deliveryOrder, {as:'deliveryOrder', foreignKey:'customer_id'})
	deliveryOrder.belongsTo(customers, {as:'customers', foreignKey:'customer_id'})


	deliveryOrder.hasMany(deliveryOrderItems, {as:'deliveryOrderItems', foreignKey:'deliveryOrder_id'})
	deliveryOrderItems.belongsTo(deliveryOrder, {as:'deliveryOrder',foreignKey:'deliveryOrder_id'})



	// associate delivery_order with products
	deliveryOrderItems.belongsTo(products, {as:'products', foreignKey:'product_id'})
	products.hasMany(deliveryOrderItems, {as:'deliveryOrder', foreignKey:'product_id'})
	// delivery_orders.hasMany(deliveryOrder_items, {as:'deliveryOrder_items',foreignKey:'delivery_id'})
	// products.hasMany(deliveryOrder_items, {as:'deliveryOrder_items',foreignKey:'product_id'})

	// deliveryOrder.belongsTo(products, {as:'products', foreignKey:'product_id'})

	// associate invoice with customers
	invoice.belongsTo(customers, {as:'customers', foreignKey:'customer_id'})
	customers.hasMany(invoice, {as:'invoice',foreignKey:'customer_id'})

	return {
		customers,
		deliveryOrder,
		invoice,
		products,
		upload_log,
		user,
		roles,
		user_roles,
		deliveryOrderItems
	}
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
