const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user_roles', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'roles',
				key: 'id'
			}
		},
		id_user: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'user',
				key: 'id'
			}
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true
		}
	},
	{
		sequelize,
		tableName: 'user_roles',
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
				name: 'user_roles_FK',
				using: 'BTREE',
				fields: [
					{ name: 'id_user' },
				]
			},
			{
				name: 'user_roles_FK_1',
				using: 'BTREE',
				fields: [
					{ name: 'roleId' },
				]
			},
		]
	})
}
