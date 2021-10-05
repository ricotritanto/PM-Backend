const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('invoice', {
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
		]
	})
}
