'use strict'
const {models, db}= require('../models')
const {Op, Sequelize } = require('sequelize')
// const Sequelize = require('sequelize')

const insertBulkDO = async(data)=>{
	// console.log(data)
	// return await models.deliveryOrder.bulkCreate(data,{
	// 	fields:['customer_id', 'delivery_order_date'] ,
	// 	updateOnDuplicate: ['customer_id','delivery_order_date'] 
	// })
	return	await models.deliveryOrder.bulkCreate(data)	
}

const insertBulk = async (data) => {	
	return	await models.deliveryOrderItems.bulkCreate(data)		
}

const insertBulkDeliveryOrder = async (data) => {
	return await models.deliveryOrder.bulkCreate(data)
}

const findByDate = async(req) =>{
	return await models.deliveryOrder.findOne({
		where: {
			delivery_order_date:req.body.delivery_order_date,
			customer_id:req.body.customer_id,
			deleted_at:null
		},
	})
}

const findByOne = async(deliveryOrder) =>{
	return await models.deliveryOrder.findOne({
		where: {
			delivery_order_date:deliveryOrder.delivery_order_date,
			customer_id:deliveryOrder.customer_id,
			deleted_at:null
		},
	})
}

const findProduct = async(cekData,dataDO)=>{
	return await models.deliveryOrderItems.findOne({
		where:{
			product_id:dataDO.product_id,
			deliveryOrder_id:cekData.id,
			deleted_at:null
		}
	})
}

const createDO = async(req)=>{
	try {
		const deliveryOrder = await db.sequelize.transaction(async (t) =>{
			const result = await models.deliveryOrder.create({
				customer_id:req.body.customer_id,
				delivery_order_date:req.body.delivery_order_date,
			},{transaction: t})
			const idDo = JSON.stringify(result.id)
			await models.deliveryOrderItems.create({
				product_id:req.body.product_id,
				buying_price:req.body.buying_price,
				selling_price:req.body.sell_price,
				qty:req.body.qty,
				deliveryOrder_id:idDo
			}, {transaction: t})            
		})
		return deliveryOrder
	} catch (error) {
		// console.log(error)
		return error
	}
}

const createDOItem = async(dataDO,checkIsExistCode)=>{
	try {
		await models.deliveryOrderItems.create({
			product_id:dataDO.product_id,
			buying_price:dataDO.buying_price,
			selling_price:dataDO.sell_price,
			qty:dataDO.qty,
			deliveryOrder_id:checkIsExistCode.id
		})
	} catch (error) {
		console.log(error)
		return error
	}
}


const getAllDO = async(data,limit =10, offset = 0)=>{
	let where= {}
	let whereCust = {}
	let whereProd = {}
	whereCust.deleted_at = null
	whereProd.deleted_at = null
	where.deleted_at = null

	if (data.customer !== undefined)
		whereCust.name = {
			[Op.like]: '%' + data.customer + '%'
		}
	if (data.product !== undefined)
		whereProd.name = {
			[Op.like]: '%' + data.product + '%'
		}
	if((data.do_date!==undefined && data.do_date2!==undefined)&&(data.do_date!=='' && data.do_date2!==''))
	{
		where.delivery_order_date = {
			[Op.between]: [data.do_date, data.do_date2]
		}
	}

	return await models.deliveryOrder.findAndCountAll({ 
		distinct: true,
		required: false,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		include:[
			{
				model: models.customers,
				as:'customers',
				required:true,
				where: whereCust,
				attributes:['id','name']
				
			},
			{
				model: models.deliveryOrderItems,
				as:'deliveryOrderItems',
				required:false,
				group:['deliveryOrder_id'],
				include:{
					model: models.products,
					as: 'products',
					required:true,
					where: whereProd,
					attributes:['id','name']
				},
			}
		],
		where,
		order:['delivery_order_date']
		
	})
		.catch(ex => {
			throw ex
		})
}

const getTotalDelivery = async()=>{
	return await models.deliveryOrder.findAndCountAll({ 
		distinct: true,
		include:[
			{
				model: models.deliveryOrderItems,
				as:'deliveryOrderItems',
				required:true,
				attributes: [
					[Sequelize.fn('SUM', Sequelize.col('selling_price')), 'totalSP'],
					[Sequelize.fn('SUM', Sequelize.col('buying_price')), 'totalBP'],
				],
				group:['deliveryOrder_id'],
				
			}
		],
		order:['delivery_order_date']
	})
}

const getChart = async()=>{
	return await models.deliveryOrderItems.findAll({ 
		distinct: true,
		required:false,
		attributes: ['*',
			[Sequelize.fn('SUM', Sequelize.col('qty')), 'totalQTY'],
		],
		include:{
			model: models.products,
			as: 'products',
			required:true,
			attributes:['id','name']
		},
		group:['product_id'],
	})
}

const getChartCustomer = async()=>{
	return await models.deliveryOrder.findAll({
		distinct:true,
		required:false,
		attributes:['customer_id',
			[Sequelize.fn('SUM', Sequelize.col('deliveryOrderItems.qty')), 'totalQTY']
		],
		include:[
			{
				model: models.customers,
				as:'customers',
				required:true,
				attributes:['id','name']
				
			},
			{
				model: models.deliveryOrderItems,
				as:'deliveryOrderItems',
				required:false,
				attributes: [],
				include:{
					model: models.products,
					as: 'products',
					required:true,
					attributes:['id','name']
				},
			},
		],
		group:['customer_id']
		
	})
}

const deleteDO = async(req)=>{
	return await models.deliveryOrderItems.destroy({
		where:{id:req}
	})
}

const find = async(req) =>{
	return await models.deliveryOrderItems.findOne({
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
	return await models.deliveryOrderItems.findAndCountAll(cond)
		.catch(ex => {
			throw ex
		})
}
const updateDO = async(req)=>{
	return await models.deliveryOrderItems.update({
		customer_id:req.body.customer_id,
		delivery_order_date:req.body.do_date,
	}
	,{
		where:{id:req.params.id}
	})
}
const updateDOItems = async(req,idDO)=>{
	return await models.deliveryOrderItems.update({
		product_id:req.body.product_id,
		buying_price:req.body.buying_price,
		selling_price:req.body.sell_price,
		qty:req.body.qty,
		deliveryOrder_id:idDO.id
	}
	,{
		where:{id:req.params.id}
	})
}

module.exports = {
	findByDate,
	createDO,
	getAllDO,
	deleteDO,
	find,
	findData,
	updateDO,
	updateDOItems,
	insertBulk,
	insertBulkDeliveryOrder,
	insertBulkDO,
	findByOne,
	findProduct,
	createDOItem,
	getTotalDelivery,
	getChart,
	getChartCustomer
}