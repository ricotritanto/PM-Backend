'use strict'
require('dotenv').config()
const productRepo = require('../repository/productsRepo')
const sequelize = require('sequelize')
const { check, validationResult } = require('express-validator')


const create = async(req)=>{
	await check('name', 'name is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:'product name is required'
		}
	}
	const checkIsExistCode = await productRepo.findOne(req)
	if(checkIsExistCode)
		return {
			status:400,
			message: req.body.name+' is already'
		}
	try {
		await productRepo.createProducts(req)
		return {
			status: 201,
			message: 'success created data'
		}
	} catch (error) {
		return {
			status: 500,
			message: 'something went wrong'
		}
	}
	
}

const update = async(req)=>{
	await check('name', 'name is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:'product name is required'
		}
	}
	const productName = await productRepo.find(req)
	if(!productName) return{
		status:400,
		message: 'product not found'
	}
	if(req.body.name != undefined && req.body.name != productName.name){
		const existingRecord = await productRepo.findData(1, 10, {}, [{name: req.body.name}])
		// console.log(existingRecord.count)
		if (existingRecord.count) {
			return {
				status: 400,
				message: 'Product name already exist!'
			}
		}
	}
	try {
		req.body.updated_at = sequelize.fn('NOW')
		await productRepo.updateById(req)
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

const deleteProduct = async(req)=>{
	try {
		await productRepo.deleteProducts(req)
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

module.exports = {
	create,
	update,
	getAll,
	deleteProduct,
}