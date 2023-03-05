'use strict'
require('dotenv').config()
const reportRepo = require('../repository/reportRepo')
const sequelize = require('sequelize')
const { check, validationResult } = require('express-validator')

const getAll = async(data) =>{
	const delivery = await reportRepo.getAllReport(data,data.per_page,data.page)
	const result = {
		count: delivery.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		// items: delivery.rows
	}
	return {
		status: 200,
		result
	}
}

module.exports = {
	getAll
}