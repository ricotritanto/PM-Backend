const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('deliveryOrderItems', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'products',
				key: 'id'
			}
		},
		deliveryOrder_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'deliveryOrder',
				key: 'id'
			}
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
		tableName: 'deliveryOrderItems',
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
					{ name: 'product_id' },
				]
			},
			{
				name: 'deliveryOrder_ibfk_2',
				using: 'BTREE',
				fields: [
					{ name: 'deliveryOrder_id' },
				]
			}
		]
	})
}
