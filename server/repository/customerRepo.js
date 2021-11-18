/* eslint-disable no-mixed-spaces-and-tabs */
'use strict'
const models = require('../models')
const {Op } = require('sequelize')

const insertBulk = async (data) => {
	return await models.customers.bulkCreate(data)
}

const getAllCustomers = async(data,limit =10, offset = 0)=>{
	const { name } = data
	var condition = name ? { name: { [Op.like]: `%${name}%` } } : null
	return await models.customers.findAndCountAll({ 
		where: condition,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		order:[['name', 'DESC']]
	 })
		.catch(ex => {
			throw ex
		})
}

const deleteCustomers = async(req)=>{
	return await models.customers.destroy({
		where:{id:req}
	})
}

const updateById = async(req)=>{
	return await models.customers.update({
		name:req.body.name.toLowerCase(),
		alias:req.body.alias,
		address:req.body.address,
		phone:req.body.phone
	}
	,{
		where:{id:req.params.id}
	})
}

const createCustomer = async(req)=>{
	return await models.customers.create({
		name:req.body.name.toLowerCase(),
		alias:req.body.alias,
		address:req.body.address,
		phone:req.body.phone
	})
}
const findData = async(customerName,req, search = {},specificWhere = []) =>{
	let where = {
		deleted_at: null,
	}
	if (Object.keys(search).length > 0) {
		where[Op.or]= []
		for (const [key, value] of Object.entries(search)) {
		  const src = {}
		  src[key] = {
				[Op.like]: '%'+value+'%'
		  }
		  where[Op.or].push(src)
		}
  
		Object.assign(where)
	  }
	  if(specificWhere.length > 0) {
		specificWhere.map(v => Object.assign(where, v))
	  }
	  const cond = {
		where,
	  }
	  return await models.customers.findAndCountAll(cond)
		.catch(ex => {
			throw ex
		})
}
const find = async(req) =>{
	return await models.customers.findOne({
		where: {
			id:req.params.id,
			deleted_at: null
		}
	})
}

const findOne = async(req) =>{
	return await models.customers.findOne({
		where: {
			name:req.body.name.toLowerCase(),
			deleted_at: null
		}
	})
}

module.exports = {
	insertBulk,
	getAllCustomers,
	deleteCustomers,
	updateById,
	createCustomer,
	findOne,
	findData,
	find
}