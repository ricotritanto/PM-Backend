'use strict'
const {models}= require('../models')
const {Op } = require('sequelize')
const Sequelize = require('sequelize')

const insertBulk = async (data) => {	
	return	await models.deliveryOrder.bulkCreate(data)		
}

const findByDate = async(req) =>{
	console.log(req.body.do_date)
	console.log('test')
	return await models.deliveryOrder.findOne({
		where: {
			delivery_order_date:req.body.do_date,
			customer_id:req.body.customer_id
		},
		deleted_at:null
	})
}


const createDO = async(req)=>{
	return await models.deliveryOrder.create({
		customer_id:req.body.customer_id,
		product_id:req.body.product_id,
		buying_price:req.body.buying_price,
		selling_price:req.body.sell_price,
		qty:req.body.qty,
		delivery_order_date:req.body.do_date,
	})
}


const getAllDO = async(data,limit =10, offset = 0)=>{
	const { name } = data
	var condition = name ? { name: { [Op.like]: `%${name}%` } } : null
	// condition = { delivery_order_date : null}
	// return await models.customers.findAndCountAll({ 
	// 	distinct: true,
	// 	where: condition,
	// 	limit:parseInt(limit),
	// 	offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
	// 	attributes:['id','name'],
	// group:[Sequelize.col('delivery_orders.delivery_order_date')],
	// include:[
			
	// 	{
	// 		model: models.delivery_orders,
	// 		as:'delivery_orders',
	// required:true,
	// attributes: ['id','customer_id','product_id','buying_price','selling_price','qty', 'delivery_order_date'],
	// include:[{
	// 	model: models.products,
	// 	as:'products',
	// 	attributes:['id','name']
	// }],
	// where:{delivery_order_date:Sequelize.col('delivery_order_date')},
	// 	where:{delivery_order_date:'2022-02-13'},
	// 	group: ['delivery_order_date'],	
	// 	having: 'customer_id'

	// },
	// {	
	// 	model: models.delivery_orders,
	// 	as:'delivery_orders',
	// 	attributes: [[Sequelize.fn('sum', Sequelize.col('delivery_orders.selling_price')), 'totalSP']]
	// }
	// ],
	// order: [
	// 	[
	// 		{ 
	// 			model: models.delivery_orders,
	// 			as: 'delivery_orders' ,
	// 			attributes:['delivery_order_date'],
	// 		}, 
	// 		'delivery_order_date', 'ASC'
	// 	]
	// ],
		
	// })
	// 	.catch(ex => {
	// 		throw ex
	// 	})

	return await models.deliveryOrder.findAndCountAll({ 
		distinct: true,
		where: condition,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		// group:[models.customers],
		// attributes:['customer_id','delivery_order_date',
		// 	[Sequelize.fn('SUM', Sequelize.col('deliveryOrder_details.selling_price')), 'totalSP'],
		// 	[Sequelize.fn('SUM', Sequelize.col('deliveryOrder_details.buying_price')), 'totalBP']
		// ],
		attributes:['id','customer_id','delivery_order_date', 'selling_price','buying_price', 'qty'],
		include:[
			{
				model: models.customers,
				as:'customers',
				// required:true,
				attributes: ['id','name'],
				group:['id']
			},
			{
				model: models.products,
				as:'products',
				required:true,
				attributes: ['id','name',
					// [Sequelize.fn('SUM', Sequelize.col('selling_price')), 'totalSP'],
					// [Sequelize.fn('SUM', Sequelize.col('buying_price')), 'totalBP']
				],
			}
		],
		// include:[{
		// 	model:models.products,
		// 	as:'products',
		// 	attributes:[
		// 		[Sequelize.fn('SUM', Sequelize.col('selling_price')), 'totalSP'],
		// 		[Sequelize.fn('SUM', Sequelize.col('buying_price')), 'totalBP']
		// 	],
		// }],
		order:['delivery_order_date','customer_id'],
		// group:['customer_id']
		
	})
		.catch(ex => {
			throw ex
		})
}

const deleteDO = async(req)=>{
	return await models.deliveryOrder.destroy({
		where:{id:req}
	})
}

const find = async(req) =>{
	return await models.delivery_orders.findOne({
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
	return await models.delivery_orders.findAndCountAll(cond)
		.catch(ex => {
			throw ex
		})
}
const updateById = async(req)=>{
	return await models.delivery_orders.update({
		customer_id:req.body.customer_id,
		product_id:req.body.product_id,
		buying_price:req.body.buying_price,
		selling_price:req.body.sell_price,
		qty:req.body.qty,
		delivery_order_date:req.body.do_date,
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
	updateById,
	insertBulk
}