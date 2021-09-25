const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Routes = require('./server/routes/index')
const path = require('path')
// const db = require('./server/models')
// var multer = require('multer')
// var upload = multer()
global.__basedir = __dirname + "";
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
// app.use(upload.single('file')) 
app.use('/api/backend/resources/assets/upload', express.static(path.join(__dirname,'resources/assets/upload')))
app.use(express.static(path.join(__dirname,'resources')))
// app.use(express.static('resources/assets/upload'))
Routes(app)

// const run = async () => {

// }

// db.sequelize.sync({ force: true }).then(() => {
// 	console.log('Drop and re-sync db.')
// 	run()
// })

const server = require('http').createServer(app) 
const PORT = process.env.PORT || process.env.APP_PORT || 4000
if (!module.parent) {
	server.listen(PORT, () => {
		console.log('Express Server Now Running. port:'+PORT)
	})
}
module.exports = app



