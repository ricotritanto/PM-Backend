var fs = require('fs')
// const getAllCustomers = require('../controller/CustomerController')
const Models = require('../models/index')
// const { create } = require('./CustomerRepo')

module.exports = {
    async upload(products){
        // First, we start a transaction and save it into a variable
        const t = await sequelize.transaction();

        try {

        // Then, we do some calls passing this transaction as an option:
		// return await Models.products.bulkCreate(products)
        const products = await models.products.bulkCreate({products},{transaction:t})
        await models.products.addSibling({products},{ transaction: t})
        // const user = await User.create({
        //     firstName: 'Bart',
        //     lastName: 'Simpson'
        // }, { transaction: t });

        // await user.addSibling({
        //     firstName: 'Lisa',
        //     lastName: 'Simpson'
        // }, { transaction: t });

        // If the execution reaches this line, no errors were thrown.
        // We commit the transaction.
        await t.commit();

        } catch (error) {

        // If the execution reaches this line, an error was thrown.
        // We rollback the transaction.
        await t.rollback();

        }
	},

    async create(req,statuse){
        return await Models.upload_log.create({
            file_name:req.file.filename,
            status:statuse,
            filetype:req.body.filetype
        })
    },

    async updateUpload(idUpload, statusnya){
        return await Models.upload_log.update({
			status:statusnya},{
			where:{
				id:idUpload
			}
		})
    }
}