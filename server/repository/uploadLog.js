'use strict'
const {models} = require('../models')

const insert = async (data) => {
	return await models.upload_log.create({
		file_name:data.fileName,
		status:data.status,
		filetype:data.fileType
	})
}

const update = async (status, id) => {
	return await models.upload_log.update({ status },{ where:{ id } })
}

const getByName = async (file_name) => {
	return await models.upload_log.findOne({
		where:{ file_name }
	})
}

module.exports = {
	insert,
	update,
	getByName
}