'use strict'
const deliveryServices = require('../services/deliveryServices')

const getAll = async(req, res, next) =>{
	return deliveryServices.getAll(req.query)
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
	return deliveryServices.create(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

module.exports = {
	getAll,
	deleteDO,
	updateDO,
	createDO
}