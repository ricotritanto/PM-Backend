'use strict'
const productServices = require('../services/productServices')

const getAll = async(req, res, next) =>{
	return productServices.getAll(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const deleteProduct = async(req, res,next)=>{
	return productServices.deleteProduct(req.params.id)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const updateProduct = async(req,res,next) =>{
	return productServices.update(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const createProduct = async(req,res, next) =>{
	return productServices.create(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

module.exports = {
	getAll,
	deleteProduct,
	updateProduct,
	createProduct
}