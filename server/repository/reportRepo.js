'use strict'
const {models}= require('../models')
const {Op } = require('sequelize')


const getAllReport = async(data,limit =10, offset = 0)=>{
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

module.exports = {
	getAllReport
}