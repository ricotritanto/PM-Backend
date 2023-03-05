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
	await check('delivery_order_date', 'delivery order date is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message:result.errors.map(msg=>msg.msg)
		}
	}
	const checkIsExistCode = await deliveryRepo.findByDate(req)
	let dataDO = req.body
	if (!checkIsExistCode) {
		try {
			await deliveryRepo.createDO(req)
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

	const cekDatane = await deliveryRepo.findProduct(checkIsExistCode, dataDO)
	if (!cekDatane) {
		try {
			await deliveryRepo.createDOItem(dataDO, checkIsExistCode)
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
	} else {
		return {
			status: 400,
			message: `${req.body.delivery_order_date} is already`
		}
	}

}

const getAll = async(data) =>{
	const delivery = await deliveryRepo.getAllDO(data,data.per_page,data.page)
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

const getTotal = async(data)=>{
	const delivery = await deliveryRepo.getTotalDelivery(data,data.per_page,data.page)
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
const getChart = async()=>{
	const result = await deliveryRepo.getChart()
	return{
		status:200,
		result
	}
}

const getChartCustomer = async()=>{
	const result = await deliveryRepo.getChartCustomer()
	return{
		status:200,
		result
	}
}

const deleteDO = async(req)=>{
	try {
		await deliveryRepo.deleteDO(req)
		return {
			status:201,
			message: 'success deleting data'
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
	await check('delivery_order_date', 'delivery order date is required').notEmpty().run(req)
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
		message: 'delivery orders item not found'
	}

	let idDO = await deliveryRepo.findByDate(req)
	if(!idDO){		
		return{
			status:400,
			message: 'You have to create a new delivery order first!'
		}
	}
	const existingRecord = await deliveryRepo.findData(1, 10, {}, [{deliveryOrder_id: idDO.id},{product_id: req.body.product_id},{id:req.params.id}])
	console.log(existingRecord)
	if (!existingRecord.count) {
		return {
			status: 400,
			message: 'Delivery Order already exist!'
		}
	}
	try {
		req.body.updated_at = sequelize.fn('NOW')
		await deliveryRepo.updateDOItems(req, idDO)
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
	getTotal,
	deleteDO,
	update,
	getChart,
	getChartCustomer
}