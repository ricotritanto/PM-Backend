'use strict'
require('dotenv').config()
const authRepo = require('../repository/authRepository')
const sequelize = require('sequelize')
const { check, validationResult } = require('express-validator')

const config = require('../config/auth.config')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

const signup = async(req,res) => {
	await check('username', 'username is required').notEmpty().run(req)
	await check('email', 'email is required').notEmpty().run(req)
	await check('password', 'password is required').notEmpty().run(req)
	await check('roles', 'role is required').notEmpty().run(req)

	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message: result.errors.map(msg=>msg.msg)
		}
	}


	const checkIsUser = await authRepo.checkUser(req,res)
	const checkEmail = await authRepo.checkEmail(req)
	if(checkIsUser)
		return {
			status:400,
			message: req.body.username+' is already exist'
			
		}
	if(checkEmail){
		return {
			status:400,
			message: req.body.email+' is already exist'
			
		}
	}
	try{
		await authRepo.signup(req,res)
		return {
			status: 201,
			result:{
				message: 'successfully',
			}
		}
		
	}catch(error) {
		return {
			status:500,
			message: error.message
		}
	}
    
} 

const signin = async(req)=>{
	const user = await authRepo.signin(req)
	// try {
	if(!user)
		return {
			status:400,
			result:{
				message: 'user not found.'
			}
		}
	var passwordIsValid = bcrypt.compareSync(
		req.body.password,
		user.password
	)
	// jika password tidak true
	if(!passwordIsValid){
		return {
			status:401,
			result:{
				accessToken: null,
				message: 'Invalid Password!'
			}
		}
	}

	var token = jwt.sign({id:user.id}, config.secret,{
		expiresIn: 86400 //24 jam
	})

	try{
		const getRoles = await authRepo.getRole(user)
		return {
			status:200,
			id:user.id,
			username: user.username,
			email: user.email,
			roles: getRoles,
			accessToken: token
		}
	}catch(err) {
		return {
			status: 500,
			message:err.message
		}
	}
    
}

const getUser = async(data)=>{
	const users = await authRepo.getAllUser(data,data.per_page,data.page)
	const result = {
		count: users.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		items: users.rows,
	}
	return {
		status: 200,
		result
	}
}

const getRoles = async(data)=>{
	const roles = await authRepo.getAllRole(data,data.per_page,data.page)
	const result = {
		count: roles.count,
		page:parseFloat(data.page),
		per_page: parseFloat(data.per_page),
		items: roles.rows,
	}
	return {
		status: 200,
		result
	}
}
const userById = async(req)=>{
	// console.log(req)
	try{		
		const result = await authRepo.getUserById(req)
		return {
			status: 201,
			message: 'successfully',
			data:result
		}
		
	}catch(error) {
		return {
			status:500,
			message: error.message
		}
	}
}



const update = async(req)=>{
	await check('username', 'name is required').notEmpty().run(req)
	await check('email', 'email is required').notEmpty().run(req)
	await check('roles', 'role is required').notEmpty().run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message: result.errors.map(msg=>msg.msg)
		}
	}
	const dataUser = await authRepo.find(req)
	if(!dataUser) return{
		status:400,
		message: 'data not found'
	}

	if(req.body.username != undefined && req.body.username != dataUser.username){
		const existingRecord = await authRepo.findData(1, 10, {}, [{username: req.body.username}])
		if (existingRecord.count) {
			return {
				status: 400,
				message: 'username already exist!'
			}
		}
	}

	if(req.body.email != undefined && req.body.email != dataUser.email){
		const existingRecord = await authRepo.findData(1, 10, {}, [{email: req.body.email}])
		if (existingRecord.count) {
			return {
				status: 400,
				message: 'email already exist!'
			}
		}
	}
	
	try{
		req.body.updated_at = sequelize.fn('NOW')
		await authRepo.updateById(req)
		return {
			status: 201,
			message: 'successfully',
		}
		
	}catch(error) {
		return {
			status:500,
			message: error.message
		}
	}

}

const deleteUser = async(req) =>{
	try {
		await authRepo.deleteUser(req)
		return {
			status:201,
			message: 'success updating data'
		}
	} catch (error) {
		return {
			status: 500,
			message: 'something went wrong'
		}
	}
}

const changePassword = async(req)=>{
	await check('password', 'password is required').notEmpty().run(req)
	await check('password', 'Password must be  8 characters !! ').isLength({ min: 8 }).run(req)
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return {
			status:422,
			message: result.errors.map(msg=>msg.msg)
		}
	}
	const dataUser = await authRepo.find(req)
	if(!dataUser) return{
		status:400,
		message: 'data not found'
	}

	try{
		req.body.updated_at = sequelize.fn('NOW')
		const result = await authRepo.updatePassword(req)
		if(result){
			return {
				status: 201,
				message: 'Update Password Successfully',
			}
		}
		
	}catch(error) {
		return {
			status:500,
			message: error.message
		}
	}
}

module.exports = {
	signup,
	signin,
	getUser,
	getRoles,
	userById,
	update,
	deleteUser,
	changePassword
}