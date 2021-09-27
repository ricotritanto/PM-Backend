var fs = require('fs')
const getAllCustomers = require('../controller/CustomerController')
const Models = require('../models/index')
const sequelize = require('sequelize');

module.exports = {
    async getAll(req){
        return await Models.customers.findAll()
    },

	async getById(req){
		return await Models.customers.findOne({
			where:{
				id:req.params.id
			}
		})
	},

	async upload(dataCustomers){
		// let t;
		// try {
		 	// t = await sequelize.transaction();
			// const customers = await Models.customers.bulkCreate({dataCustomers},{transacting});
			// await Models.customers.addSibling({dataCustomers},{transaction:t})
			return await Models.customers.bulkCreate(dataCustomers)
			// step 1
			// await Models.customers.destroy({ where: {id}, t });

			// step 2
			// await Models.customers.bulkCreate({dataCustomers}, { t });

			// step 3
			// await Models.customers.update({}, { where: { id }, t });

			// commit
			// await t.commit();
		// } catch (error) {
			// if (t) await t.rollback();
		// }
	},

    async create(req){
		return await Models.customers.create({
			name:req.body.name,
			alias:req.body.alias,
			address:req.body.address,
			phone:req.body.phone
		})
	},

    async update(req){
		return await Models.customers.update({
			name:req.body.name,
			alias:req.body.alias,
			address:req.body.address,
			phone:req.body.phone},{
			where:{
				id:req.params.id
			}
		})
    },

	async delete(req){
		return await Models.customers.destroy({
			where:{id:req.params.id}
		})
	}
}