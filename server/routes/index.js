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
const reportController = require('../controller/report')

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
	app.post('/api/file/upload',[authJwt.verifyToken],fileUploader.uploadExcelFile, uploadFile.uploadExcel)


	// api products
	app.get('/api/products', [authJwt.verifyToken],productController.getAll)
	app.delete('/api/products/:id', [authJwt.verifyToken],productController.deleteProduct)
	app.put('/api/products/:id', [authJwt.verifyToken],productController.updateProduct)
	app.post('/api/products/', [authJwt.verifyToken],productController.createProduct)



	// api customers
	app.get('/api/customers',[authJwt.verifyToken], customerController.getAll)
	app.delete('/api/customers/:id', [authJwt.verifyToken],customerController.deleteCustomer)
	app.put('/api/customers/:id', [authJwt.verifyToken],customerController.updateCustomer)
	app.post('/api/customers/', [authJwt.verifyToken],customerController.createCustomer)
	

	// api user
	app.get('/api/users', [authJwt.verifyToken],authController.getUser)
	app.get('/api/roles', [authJwt.verifyToken], authController.getRole)
	// app.get('/api/users/:id', authController.getById)
	app.put('/api/users/:id', [authJwt.verifyToken],authController.updateUser)
	app.delete('/api/users/:id', [authJwt.verifyToken],authController.deleteUser)
	app.put('/api/users/changepassword/:id', [authJwt.verifyToken],authController.changePassword)

	// api delivery delivery_orders
	app.post('/api/delivery_orders', [authJwt.verifyToken],doController.createDO)
	app.get('/api/delivery_orders', [authJwt.verifyToken],doController.getAll)
	app.delete('/api/delivery_orders/:id',[authJwt.verifyToken], doController.deleteDO)
	app.put('/api/delivery_orders/:id', [authJwt.verifyToken], doController.updateDO)
	app.get('/api/delivery_orders/total',[authJwt.verifyToken], doController.getTotal)
	app.get('/api/delivery_orders/chart', [authJwt.verifyToken],doController.getChart)
	app.get('/api/delivery_orders/chart/customer',[authJwt.verifyToken], doController.getChartCustomer)


	// api delivery invoice
	app.post('/api/invoice', [authJwt.verifyToken],invoiceController.createInvoice)
	app.get('/api/invoice', [authJwt.verifyToken],invoiceController.getAll)
	app.delete('/api/invoice/:id', [authJwt.verifyToken],invoiceController.deleteInvoice)
	app.put('/api/invoice/:id', [authJwt.verifyToken],invoiceController.updateInvoice)

	// api report
	app.get('/api/report', [authJwt.verifyToken],reportController.getAll)

	// test user controller
	app.get('/api/test/all', [authJwt.verifyToken],userController.allAccess)

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
