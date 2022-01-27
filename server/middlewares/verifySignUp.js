'use strict'
const models = require('../models')
// const {Op } = require('sequelize')
// const sequelize = require('sequelize')

const checkDuplicateUsernameOrEmail = async (req, res, next) =>{
	// username
	await models.user.findOne({
		where:{
			username: req.body.username
		}
	}).then(user =>{
		if(user){
			res.status(400).send({
				message:'failed! username is already in use'
			})
			return
		}
		next()
	})

	// email
	await models.user.findOne({
		where:{
			email: req.body.email
		}
	}).then(user =>{
		if(user){
			res.status(400).send({
				message: 'failed! email is already in use'
			})
			return
		}
	})
}

// checkRolesExisted = (req,res,next)=>{
// 	if(req.body.roles){
// 		for(let i = 0; i<req.body.roles.length;i++){
// 			if(!ROLES.includes(req.body.roles[i])){
// 				res.status(400).send({
// 					message: 'Failed! Role does not exist='+req.body.roles[i]
// 				})
// 				return
// 			}
// 		}
// 	}
// 	next()
// }

const verifySignUp = {
	checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
	// checkRolesExisted: checkRolesExisted
}
  

module.exports = verifySignUp