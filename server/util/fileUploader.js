'use strict'
require('dotenv').config()
const multer = require('multer')

const excelFilter = (req, file, cb) => {
	if (req.body.file_type == undefined){
		cb('no file type defined.', true)
		return
	}
	const fileTypes = ['products','customers','deliveryOrder','invoice']
	if(!fileTypes.includes(req.body.file_type)){
		cb('invalid file_type value.', true)
		return
	}
	if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
		cb(null, true)
	} else {
		cb('Please upload only excel file.', false)
		return
	}
}

const storage = multer.diskStorage({
	
	destination: (req, file, cb) => {
		cb(null, process.env.FULL_FILEPATH)
	},
	filename: (req, file, cb) => {
		let resultnya = `${Date.now()}-fileupload-${file.originalname}` 
		req.body.result_file_name = resultnya
		cb(null, resultnya)
	}, 
})

const uploadExcelFile = (req, res, next) => {
	const upload = multer({ 
		storage, 
		fileFilter: excelFilter 
	}).single('file')

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).send({
				message: 'Internal Server Error',
				err_message: err
			})
		} else if (err) {
			return res.status(400).send({
				message: err
			})
		}
		next()
	})
}

module.exports = {
	uploadExcelFile
}
