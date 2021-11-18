'use strict'
const customerServices = require('../services/customerServices')

const getAll = async(req, res, next) =>{
	return customerServices.getAll(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const deleteCustomer = async(req, res,next)=>{
	return customerServices.deleteData(req.params.id)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const updateCustomer = async(req,res,next) =>{
	return customerServices.update(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const createCustomer = async(req,res, next) =>{
	return customerServices.create(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

module.exports = {
	getAll,
	deleteCustomer,
	updateCustomer,
	createCustomer
}