const productController = require('../controller/productController')
const CustomerController = require('../controller/customerController')
const uploadLogController = require('../controller/uploadLogController')
const multer = require('multer')
const upload = require('../middlewares/upload')

module.exports = app =>{
	app.get('/api', (req, res) => {
		res.status(200).send({
			data: 'Selamat Datang di API V1 Putra Manunggal',
		})
	})

	// route untuk ikan
	// app.get('/api/product', productController.getDataIkan)
	// app.post('/api/product',upload.single('file'), productController.upload)
	// app.post('/api/product/create',productController.create)
	// app.put('/api/product/:id', productController.update)
	// app.get('/api/product/:id', productController.getById)
	// app.delete('/api/product/:id', productController.delete)


	// route untuk customers
	app.get('/api/customers', CustomerController.getAllCustomers)
	// app.post('/api/customers',upload.single('file'), CustomerController.upload)
	app.post('/api/customer/create',CustomerController.create)
	app.put('/api/customer/:id', CustomerController.update)
	app.get('/api/customer/:id', CustomerController.getByID)
	app.delete('/api/customer/:id', CustomerController.delete)

	// route upload
	
	app.post('/api/upload',upload.single('file'), uploadLogController.upload)
	// app.post('/api/upload',uploadLogController.upload)
    
    
	// route untuk category
	// app.get('/api/category', categoryController.getAllCategory)
	// app.post('/api/category', categoryController.create)
	// app.put('/api/category/:id', categoryController.update)
	// app.delete('/api/category/:id', categoryController.delete)

	// route untuk products
	app.get('/api/products', productController.getAllProducts)
	app.post('/api/product', productController.create)
	app.put('/api/products/:id', productController.update)
	app.delete('/api/product/:id', productController.delete)
	// app.get('/api/products/:barcode',productController.getByBarcode)
}
