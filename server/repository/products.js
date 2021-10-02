'use strict'
const models = require('../models')

const insertBulk = async (data) => {
	return await models.products.bulkCreate(data)
}

module.exports = {
	insertBulk
}