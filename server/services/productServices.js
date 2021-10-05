'use strict'
require('dotenv').config()
const productRepo = require('../repository/products')
const sequelize = require('sequelize')


const create = async(body)=>{
	const checkIsExistCode = await productRepo.findOne(body)
	if(checkIsExistCode)return {status:400,message: body.name+' is already'}
	const result = await productRepo.createProducts(body)
	return {
		status: 201,
		result
	}
}

const update = async(id, body)=>{
	const checkIsExistCode = await productRepo.findOne(body)
	if(checkIsExistCode)
	{
		return {status:400,message: body.name+' is already'}
	}else{
		try {
			body.updated_at = sequelize.fn('NOW')
			await productRepo.updateById(id, body)
			return {
				status:201,
				message: 'success updating data'
			}
		} catch (error) {
			return {
				status: 500,
				message: 'something went wrong'
			}
		}
	}
}

const getAll = async(data) =>{
	const products = await productRepo.getAllProducts(data,data.per_page,data.page)
	const result = {
		count: products.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		items: products.rows
	}
	return {
		status: 200,
		result
	}
}

module.exports = {
	create,
	update,
	getAll
}