'use strict'
require('dotenv').config()
const customerRepo = require('../repository/customerRepo')
const sequelize = require('sequelize')
const { check, validationResult } = require('express-validator')

const create = async(req)=>{
	await check('name', 'name is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:'customer name is required'
		}
	}

	const checkIsExistCode = await customerRepo.findOne(req)
	if(checkIsExistCode)
		return {
			status:400,
			message: req.body.name+' is already'
		}
	try {
		await customerRepo.createCustomer(req)
		return {
			status:201,
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
			message:'customer name is required'
		}
	}
	const customerName = await customerRepo.find(req)
	if(!customerName) return{
		status:400,
		message: 'customer name not found'
	}
	if(req.body.name != undefined && req.body.name != customerName.name){
		const existingRecord = await customerRepo.findData(1, 10, {}, [{name: req.body.name}])
		if (existingRecord.count) {
			return {
				status: 400,
				message: 'customer name already exist!'
			}
		}
	}
	try {
		req.body.updated_at = sequelize.fn('NOW')
		await customerRepo.updateById(req)
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
	const customers = await customerRepo.getAllCustomers(data,data.per_page,data.page)
	const result = {
		count: customers.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		items: customers.rows
	}
	return {
		status: 200,
		result
	}
}

const deleteData = async(req) =>{
	try {
		await customerRepo.deleteCustomers(req)
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
	deleteData
}