'use strict'
const uploadFile = require('../controller/uploadFile')
const fileUploader = require('../util/fileUploader')

module.exports = app =>{
	app.get('/api/health', (req, res) => {
		res.status(200).send({
			message: 'api is up and running',
		})
	})

	
	app.post('/api/file/upload',fileUploader.uploadExcelFile, uploadFile.uploadExcel)
	
}
