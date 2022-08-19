'use strict'
const uploadFile = require('../controller/uploadFile')
const productController = require('../controller/products')
const customerController = require('../controller/customers')
const fileUploader = require('../util/fileUploader')
const {authJwt } = require('../middlewares/index')
const authController = require('../controller/auth')
const userController = require('../controller/user')
const doController = require('../controller/do')
const invoiceController = require('../controller/invoice')

module.exports = app =>{
	app.get('/api/health', (req, res) => {
		res.status(200).send({
			message: 'api is up and running',
		})
	})

	app.use(function(req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		)
		next()
	})

	app.post(
		'/api/auth/signup',[
			// verifySignUp.checkDuplicateUsernameOrEmail,
			// verifySignUp.checkRolesExisted
		],
		authController.signup
	)
	
	app.post('/api/auth/signin', authController.signin)

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
	

	// api user
	app.get('/api/users', authController.getUser)
	app.get('/api/roles', authController.getRole)
	// app.get('/api/users/:id', authController.getById)
	app.put('/api/users/:id', authController.updateUser)
	app.delete('/api/users/:id', authController.deleteUser)
	app.put('/api/users/changepassword/:id', authController.changePassword)

	// api delivery delivery_orders
	app.post('/api/delivery_orders', doController.createDO)
	app.get('/api/delivery_orders', doController.getAll)
	app.delete('/api/delivery_orders/:id', doController.deleteDO)
	app.put('/api/delivery_orders/:id', doController.updateDO)


	// api delivery invoice
	app.post('/api/invoice', invoiceController.createInvoice)
	app.get('/api/invoice', invoiceController.getAll)
	app.delete('/api/invoice/:id', invoiceController.deleteInvoice)
	app.put('/api/invoice/:id', invoiceController.updateInvoice)




	// test user controller
	app.get('/api/test/all', userController.allAccess)

	app.get(
		'/api/test/user',
		[authJwt.verifyToken],
		userController.userBoard
	)

	app.get(
		'/api/test/mod',
		[authJwt.verifyToken],
		userController.moderatorBoard
	)

	app.get(
		'/api/test/admin',
		[authJwt.verifyToken, authJwt.isAdmin],
		userController.adminBoard
	)
}
