'use strict'
const reportServices = require('../services/reportServices')

const getAll = async(req, res, next) =>{
	return reportServices.getAll(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}


module.exports = {
	getAll,
}