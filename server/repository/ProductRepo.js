var fs = require('fs')
const getAllProducts = require('../controller/productController')
const Models = require('../models/index')
const sequelize = require('sequelize');

module.exports = {
    async getAll(req){
        return await Models.products.findAll()
    },

	async getById(req){
		return await Models.products.findOne({
			where:{
				id:req.params.id
			}
		})
	},

	async upload(dataProducts){
		// let t;
		// try {
		 	// t = await sequelize.transaction();
			// const customers = await Models.customers.bulkCreate({dataCustomers},{transacting});
			// await Models.customers.addSibling({dataCustomers},{transaction:t})
			return await Models.products.bulkCreate(dataProducts)
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
		return await Models.products.create({
			name:req.body.name,
			alias:req.body.alias
		})
	},

    async update(req){
		return await Models.products.update({
			name:req.body.name,
			alias:req.body.alias},{
			where:{
				id:req.params.id
			}
		})
    },

	async delete(req){
		return await Models.products.destroy({
			where:{id:req.params.id}
		})
	}
}