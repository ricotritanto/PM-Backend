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
		order:[['name', 'DESC']]
	 })
		.catch(ex => {
			throw ex
		})
}

const deleteProducts = async(req)=>{
	return await models.products.destroy({
		where:{id:req}
	})
}

const updateById = async(req)=>{
	return await models.products.update({
		name:req.body.name.toLowerCase(),
		alias:req.body.alias
	}
	,{
		where:{id:req.params.id}
	})
}

const createProducts = async(req)=>{
	return await models.products.create({
		name:req.body.name.toLowerCase(),
		alias:req.body.alias
	})
}
const find = async(req) =>{
	return await models.products.findOne({
		where: {
			id:req.params.id,
			deleted_at: null
		}
	})
}

const findData = async(page, perpage,search = {},specificWhere = []) =>{
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
	  return await models.products.findAndCountAll(cond)
		.catch(ex => {
			throw ex
		})
}
const findOne = async(req) =>{
	return await models.products.findOne({
		where: {name:req.body.name.toLowerCase()},
		deleted_at:null
	})
}

module.exports = {
	insertBulk,
	getAllProducts,
	deleteProducts,
	updateById,
	createProducts,
	findOne,
	find,
	findData
}