/* eslint-disable no-mixed-spaces-and-tabs */
'use strict'
const models = require('../models')
const {Op } = require('sequelize')

const insertBulk = async (data) => {
	return await models.products.bulkCreate(data)
}

const getAllProducts = async(data,limit =10, offset = 0)=>{
	const { name } = data
	var condition = name ? { name: { [Op.like]: `%${name}%` } } : null
	return await models.products.findAndCountAll({ 
		where: condition,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		// order:[['name', 'DESC']]
	 })
		.catch(ex => {
			throw ex
		})
}

const deleteProducts = async(req)=>{
	return await models.products.destroy({
		where:{id:req.params.id}
	})
}

const updateById = async(id, body)=>{
	return await models.products.update({
		name:body.name,
		alias:body.alias
	}
	,{
		where:{id:id}
	})
}

const createProducts = async(body)=>{
	return await models.products.create({
		name:body.name,
		alias:body.alias
	})
}

const findOne = async(body) =>{
	return await models.products.findOne({
		where: {name:body.name}
	})
}

module.exports = {
	insertBulk,
	getAllProducts,
	deleteProducts,
	updateById,
	createProducts,
	findOne
}