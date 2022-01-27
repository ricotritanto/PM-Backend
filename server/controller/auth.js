'user strict'

const authServices = require('../services/authServices')

const signup = async(req,res, next) =>{
	return authServices.signup(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err.message))
}

const signin = async(req,res, next) =>{
	return authServices.signin(req)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const getUser = async(req, res, next) =>{
	return authServices.getUser(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const getRole = async(req, res, next) =>{
	return authServices.getRoles(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}
const getById = async(req,res,next)=>{
	return authServices.userById(req.query)
		.then(result => res.status(result.status).send(result))
		.catch(err => next(err))
}

const updateUser = async(req,res,next) =>{
	return authServices.update(req)
		.then(result=> res.status(result.status).send(result))
		.catch(err=>next(err)) 
}

const deleteUser = async(req,res,next)=>{
	return authServices.deleteUser(req)
		.then(result=>res.status(result.status).send(result))
		.catch(err => next(err))
}

const changePassword = async(req,res,next)=>{
	return authServices.changePassword(req)
		.then(result=>res.status(result.status).send(result))
		.catch(err => next(err))
}


module.exports = {
	// getAll,
	signin,
	signup,
	getUser,
	getRole,
	getById,
	updateUser,
	deleteUser,
	changePassword
}