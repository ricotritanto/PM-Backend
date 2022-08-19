const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('upload_log', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		file_name: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('UPLOADED','PROCESSED','FAILED'),
			allowNull: true,
			defaultValue: 'UPLOADED'
		},
		filetype: {
			type: DataTypes.ENUM('customers','products','invoice','deliveryOrder'),
			allowNull: false
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
		}
	}, {
		sequelize,
		tableName: 'upload_log',
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
