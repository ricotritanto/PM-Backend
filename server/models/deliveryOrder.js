const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('deliveryOrder', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		customer_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'customers',
				key: 'id'
			}
		},
		delivery_order_date: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.Sequelize.DATEONLY,
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
		tableName: 'deliveryOrder',
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
			{
				name: 'deliveryOrder_ibfk_1',
				using: 'BTREE',
				fields: [
					{ name: 'customer_id' },
				]
			},
		]
	})
}
