'use strict'
const uploadFile = require('../controller/uploadFile')
const productController = require('../controller/products')
const customerController = require('../controller/customers')
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



	// api customers
	app.get('/api/customers', customerController.getAll)
	app.delete('/api/customers/:id', customerController.deleteCustomer)
	app.put('/api/customers/:id', customerController.updateCustomer)
	app.post('/api/customers/', customerController.createCustomer)
	
}
