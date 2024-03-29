'use strict'
const {models}= require('../models')
const {Op } = require('sequelize')

const insertBulk = async (data) => {	
	console.log(data)
	return	await models.invoice.bulkCreate(data)		
}

const findByDate = async(req) =>{
	return await models.invoice.findOne({
		where: (
			{invoice_date:req.body.invoice_date},
			{customer_id:req.body.customer_id}
		),
		deleted_at:null
	})
}

const findID = async(invoice)=>{
	return await models.invoice.findOne({
		where:{
			invoice_date:invoice.invoice_date,
			customer_id:invoice.customer_id
		},
		deleted_at:null
	})
}


const createInvoice = async(req)=>{
	return await models.invoice.create({
		customer_id:req.body.customer_id,
		dispentation:req.body.dispentation,
		amount:req.body.amount,
		invoice_date:req.body.invoice_date,
	})
}


const getAllInvoice = async(data,limit =10, offset = 0)=>{
	let where= {}
	let whereCust = {}
	whereCust.deleted_at = null
	where.deleted_at = null
	if (data.customer !== undefined)
		whereCust.name = {
			[Op.like]: '%' + data.customer + '%'
		}
	if((data.invoice_date!==undefined && data.invoice_date2!==undefined)&&(data.invoice_date!=='' && data.invoice_date2!==''))
	{
		where.invoice_date = {
			[Op.between]: [data.invoice_date, data.invoice_date2]
		}
	}

	return await models.invoice.findAndCountAll({ 
		distinct: true,
		required: false,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		include:{
			model: models.customers,
			as:'customers',
			where: whereCust,
			attributes: ['id','name']				
		},
		where,
		order:[['invoice_date', 'DESC']]
	})
		.catch(ex => {
			console.log(ex)
			throw ex
		})
}

const deleteInvoice = async(req)=>{
	return await models.invoice.destroy({
		where:{id:req}
	})
}

const find = async(req) =>{
	return await models.invoice.findOne({
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
	return await models.invoice.findAndCountAll(cond)
		.catch(ex => {
			throw ex
		})
}
const updateById = async(req)=>{
	return await models.invoice.update({
		customer_id:req.body.customer_id,
		dispentation:req.body.dispentation,
		amount:req.body.amount,
		invoice_date:req.body.invoice_date,
	}
	,{
		where:{id:req.params.id}
	})
}

module.exports = {
	insertBulk,
	findByDate,
	createInvoice,
	getAllInvoice,
	deleteInvoice,
	find,
	findData,
	updateById,
	findID
}