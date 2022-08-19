'use strict'
require('dotenv').config()
const deliveryRepo = require('../repository/deliveryRepo')
const sequelize = require('sequelize')
const { check, validationResult } = require('express-validator')

const create = async(req)=>{
	await check('customer_id', 'customer is required').notEmpty().run(req)
	await check('product_id', 'product is required').notEmpty().run(req)
	await check('buying_price', 'buying price is required').notEmpty().run(req)
	await check('sell_price', 'selling price is required').notEmpty().run(req)
	await check('qty', 'qty is required').notEmpty().run(req)
	await check('do_date', 'delivery order date is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:result.errors.map(msg=>msg.msg)
		}
	}

	const checkIsExistCode = await deliveryRepo.findByDate(req)
	console.log(checkIsExistCode)
	if(checkIsExistCode !=null)
		return {
			status:400,
			message: req.body.do_date+' is already'
		}
	try {
		await deliveryRepo.createDO(req)
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
	const delivery = await deliveryRepo.getAllDO(data,data.per_page,data.page)
	console.log(delivery)
	// let transaction = []
	// delivery.rows.forEach(element => {
	// 	customers=element.customer_id
	// })
	const result = {
		count: delivery.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		items: delivery.rows,
	}
	return {
		status: 200,
		result
	}
}

const deleteDO = async(req)=>{
	try {
		await deliveryRepo.deleteDO(req)
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
	await check('product_id', 'product is required').notEmpty().run(req)
	await check('buying_price', 'buying price is required').notEmpty().run(req)
	await check('sell_price', 'selling price is required').notEmpty().run(req)
	await check('qty', 'qty is required').notEmpty().run(req)
	await check('do_date', 'delivery order date is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:result.errors.map(msg=>msg.msg)
		}
	}
	const delivery = await deliveryRepo.find(req)
	if(!delivery) return{
		status:400,
		message: 'delivery orders not found'
	}
	// if(req.body.do_date != undefined && req.body.do_date != delivery.delivery_order_date){
	// 	const existingRecord = await deliveryRepo.findData(1, 10, {}, [{name: req.body.name}])
	// 	// console.log(existingRecord.count)
	// 	if (existingRecord.count) {
	// 		return {
	// 			status: 400,
	// 			message: 'Product name already exist!'
	// 		}
	// 	}
	// }
	try {
		req.body.updated_at = sequelize.fn('NOW')
		await deliveryRepo.updateById(req)
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
	deleteDO,
	update
}