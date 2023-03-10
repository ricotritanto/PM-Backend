const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const models = require('../models')

const verifyToken = (req, res, next) => {
	let token = req.headers['x-access-token']
	if(!token) {
		return res.status(403).send({
			message: 'no token provided!'
		})
	}

	jwt.verify(token, config.secret, (err, decoded)=>{
		if(err){
			return res.status(401).send({
				message:'Unauthorized!'
			})
		}
		req.userId= decoded.id
		next()
	})
}

const isAdmin = async (req, res, next) =>{
	models.user.findByPk(req.userId).then(user => {
		models.roles.findAll().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].role === 'admin') {
					next()	
					return
				}
			}
	
			res.status(403).send({
				message: 'Require Admin Role!'
			})
			return
		})
	})
}

const isOperator = (req, res, next) =>{
	// models.user.findByPk(req.userId).then(user =>{
	// 	for (let i = 0; i < roles.length; i++){
	// 		if(roles[i].name === 'operator'){
	// 			next()
	// 			return
	// 		}
	// 	}

	// 	res.status(403).send({
	// 		message:'Require Operator Role!'
	// 	})
	// 	return
	// })
}


const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
	isOperator: isOperator
}

module.exports = authJwt