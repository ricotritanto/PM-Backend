'use strict'
const uploadFile = require('../controller/uploadFile')
const productController = require('../controller/products')
const fileUploader = require('../util/fileUploader')

module.exports = app =>{
	app.get('/api/health', (req, res) => {
		res.status(200).send({
			message: 'api is up and running',
		})
	})

	// api uploads
	app.post('/api/file/upload',fileUploader.uploadExcelFile, uploadFile.uploadExcel)


	// api products
	app.get('/api/products', productController.getAll)
	app.delete('/api/products/:id', productController.deleteProduct)
	app.put('/api/products/:id', productController.updateProduct)
	app.post('/api/products/', productController.createProduct)
	
}
