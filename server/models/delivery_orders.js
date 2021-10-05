const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('delivery_orders', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		customer_name: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		product_name: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		buying_price: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0
		},
		selling_price: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0
		},
		qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		delivery_order_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 'delivery_orders',
		timestamps: false,
		indexes: [
			{
				name: 'PRIMARY',
				unique: true,
				using: 'BTREE',
				fields: [
					{ name: 'id' },
				]
			},
		]
	})
}
