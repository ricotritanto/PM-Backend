'use strict'
const productRepo = require('../repository/products')
const productServices = require('../services/productServices')

const getAll = async(req, res, next) =>{
	return productServices.getAll(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const deleteProduct = async(req, res)=>{
	try {
		await productRepo.deleteProducts(req)
		return res.status(200).send({
			message:'success'
		})
	} catch (error) {
		return res.status(500).send({
			message: 'internal server error',
			err_message: error
		})
	}
}

const updateProduct = async(req,res,next) =>{
	return productServices.update(req.params.id,req.body)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const createProduct = async(req,res, next) =>{
	return productServices.create(req.body)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

module.exports = {
	getAll,
	deleteProduct,
	updateProduct,
	createProduct
}