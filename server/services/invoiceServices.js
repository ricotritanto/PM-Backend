'use strict'
require('dotenv').config()
const invoiceRepo = require('../repository/invoiceRepo')
const sequelize = require('sequelize')
const { check, validationResult } = require('express-validator')

const create = async(req)=>{
	await check('customer_id', 'customer is required').notEmpty().run(req)
	await check('dispentation', 'dispentation is required').notEmpty().run(req)
	await check('amount', 'amount is required').notEmpty().run(req)
	await check('invoice_date', 'invoice date is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:result.errors.map(msg=>msg.msg)
		}
	}

	const checkIsExistCode = await invoiceRepo.findByDate(req)
	if(checkIsExistCode)
		return {
			status:400,
			message: 'customer with the invoice date '+req.body.invoice_date+ ' is already'
		}
	try {
		await invoiceRepo.createInvoice(req)
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

const getAll = async(data) =>{
	const delivery = await invoiceRepo.getAllInvoice(data,data.per_page,data.page)
	const result = {
		count: delivery.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		items: delivery.rows
	}
	return {
		status: 200,
		result
	}
}

const deleteInvoice = async(req)=>{
	try {
		await invoiceRepo.deleteInvoice(req)
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

const update = async(req)=>{
	await check('customer_id', 'customer is required').notEmpty().run(req)
	await check('dispentation', 'dispentation is required').notEmpty().run(req)
	await check('amount', 'amount is required').notEmpty().run(req)
	await check('invoice_date', 'invoice date is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:result.errors.map(msg=>msg.msg)
		}
	}
	const delivery = await invoiceRepo.find(req)
	if(!delivery) return{
		status:400,
		message: 'invoice not found'
	}
	if(req.body.invoice_date == undefined || req.body.invoice_date == delivery.invoice_date){
		const existingRecord = await invoiceRepo.findData(1, 10, {}, [{invoice_date: req.body.invoice_date}])
		if (existingRecord.count) {
			return {
				status: 400,
				message: 'invoice already exist!'
			}
		}
	}
	try {
		req.body.updated_at = sequelize.fn('NOW')
		await invoiceRepo.updateById(req)
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
	getAll,
	deleteInvoice,
	update
}