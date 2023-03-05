const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('invoice', {
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
		dispentation: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0
		},
		amount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0
		},
		invoice_date: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.Sequelize.DATEONLY
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
		tableName: 'invoice',
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
				name: 'invoice_FK',
				using: 'BTREE',
				fields: [
					{ name: 'customer_id' },
				]
			},
		]
	})
}
