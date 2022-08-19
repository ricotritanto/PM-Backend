'use strict'
require('dotenv').config()
const express = require('express')

const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Routes = require('./server/routes')
const path = require('path')


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use('/api/backend/resources/assets/upload', express.static(path.join(__dirname,'resources/assets/upload')))
app.use(express.static(path.join(__dirname,'resources')))

process.env.FULL_FILEPATH = __dirname + '/'+process.env.FILEPATH

Routes(app)


// const db = require('./server/models')
// db.sequelize.sync({ force: true }).then(() => {
// 	console.log('Drop and re-sync db.')
// })

// const db = require('./server/models')
// const Role = db.role;

// db.sequelize.sync()

const server = require('http').createServer(app) 
const PORT = process.env.PORT || process.env.APP_PORT || 3001
if (!module.parent) {
	server.listen(PORT, () => {
		console.log('Express Server Now Running. port:'+PORT)
	})
}
module.exports = app