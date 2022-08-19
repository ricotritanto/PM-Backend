'use strict'
const invoiceServices = require('../services/invoiceServices')

const getAll = async(req, res, next) =>{
	return invoiceServices.getAll(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const deleteInvoice = async(req, res,next)=>{
	return invoiceServices.deleteInvoice(req.params.id)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const updateInvoice = async(req,res,next) =>{
	return invoiceServices.update(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const createInvoice = async(req,res, next) =>{
	return invoiceServices.create(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

module.exports = {
	getAll,
	deleteInvoice,
	updateInvoice,
	createInvoice
}