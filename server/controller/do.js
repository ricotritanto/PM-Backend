'use strict'
const deliveryServices = require('../services/deliveryServices')

const getAll = async(req, res, next) =>{
	return deliveryServices.getAll(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const getTotal = async(req,res,next)=>{
	return deliveryServices.getTotal(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const getChart = async(req,res,next)=>{
	return deliveryServices.getChart(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const getChartCustomer = async(req,res,next)=>{
	return deliveryServices.getChartCustomer(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const deleteDO = async(req, res,next)=>{
	return deliveryServices.deleteDO(req.params.id)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const updateDO = async(req,res,next) =>{
	return deliveryServices.update(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const createDO = async(req,res, next) =>{
	return deliveryServices.create(req,res)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

module.exports = {
	getAll,
	getTotal,
	deleteDO,
	updateDO,
	createDO,
	getChart,
	getChartCustomer
}