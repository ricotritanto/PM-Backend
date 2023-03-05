'use strict'
const uploadFileService = require('../services/uploadFile')
const uploadFileRepo = require('../repository/uploadLog')

const uploadExcel = async (req, res) => {
	try {
		await uploadFileRepo.insert({
			fileName: req.body.result_file_name,
			status:'UPLOADED',
			fileType: req.body.file_type
		})
		uploadFileService.uploadData(req.body.result_file_name, req.body.file_type)
		return res.status(200).send({
			message: 'success',
		})	
	} catch (error) {
		return res.status(500).send({
			message: 'internal server error',
			err_message: error
		})
	}
	
	
}

module.exports = {
	uploadExcel
}