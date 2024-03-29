'use strict'
const {models, db} = require('../models')
const {Op} = require('sequelize')
// const db = abc

var bcrypt = require('bcryptjs')

const signup = async(req) =>{
	try {
		const user = await db.sequelize.transaction(async (t) =>{
			const result = await models.user.create({
				username: req.body.username,
				email: req.body.email,
				password: bcrypt.hashSync(req.body.password, 8)
			},{transaction: t})
			const idUser = JSON.stringify(result.id)

			await models.user_roles.create({
				roleId:req.body.roles,
				id_user:idUser
			}, {transaction: t})            
		})
		return user
	} catch (error) {
		console.log(error)
	}
}

const signin = async (req) =>{
	return await models.user.findOne({
		where:{
			email:req.body.email
		}
	})
	
}


const checkUser = async(req)=>{
	return await models.user.findOne({
		where:{
			username: req.body.username
		}
	})
}

const checkEmail = async(req)=>{
	return await models.user.findOne({
		where:{
			email: req.body.email
		}
	})
}

const getRole = async(user)=>{
	return await models.user.findAndCountAll({
		where: {
			id:user.id,	
			deleted_at: null
		},
		include:[{
			model: models.roles,
			through:{attributes: []},
			as:'roles'
		}]
	})
}


const getAllUser = async(data,limit =10, offset = 0)=>{
	const { username } = data
	var condition = username ? { username: { [Op.like]: `%${username}%` } } : null
	return await models.user.findAndCountAll({ 
		where: condition,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		include:{
			model: models.roles,
			through:{attributes: []},
			as:'roles'
		},
		order:[['username', 'DESC']]
	})
		.catch(ex => {
			throw ex
		})
}
const getAllRole = async(data,limit =10, offset = 0)=>{
	const { role } = data
	var condition = role ? { username: { [Op.like]: `%${role}%` } } : null
	return await models.roles.findAndCountAll({ 
		where: condition,
		limit:parseInt(limit),
		offset: (offset <= 1) ? 0 : ((offset - 1) * parseFloat(limit)),
		order:[['role', 'DESC']]
	})
		.catch(ex => {
			throw ex
		})
}

const getUserById = async(req) =>{
	return await models.user.findById({
		where: {
			id:req.params.id,
			deleted_at: null
		}
	})

}

const updateById = async(req)=>{
	try {
		const user = await db.sequelize.transaction(async (t) =>{
			await models.user.update({
				username:req.body.username.toLowerCase(),
				email:req.body.email,
				role:req.body.roles,
				// password:bcrypt.hashSync(req.body.password, 8),
				updated_at:req.body.updated_at
			},{
				where:{id:req.params.id}
			}, {transaction: t})
			await models.user_roles.update({
				roleId:req.body.roles,
				id_user:req.params.id,
				updated_at:req.body.updated_at
			},{
				where:{id_user:req.params.id}
			}, {transaction: t})
		})
		return user
	} catch (error) {
		console.log(error)
		return error
	}
}

const find = async(req)=>{
	return await models.user.findOne({
		where: {
			id:req.params.id,
			deleted_at: null
		}
	})
}

const findData = async(page, perpage,search = {},specificWhere = []) =>{
	let where = {
		deleted_at: null,
	}
	if (Object.keys(search).length > 0) {
		where[Op.or]= []
		for (const [key, value] of Object.entries(search)) {
			const src = {}
			src[key] = {
				[Op.like]: '%'+value+'%'
			}
			where[Op.or].push(src)
		}
  
		Object.assign(where)
	}
	if(specificWhere.length > 0) {
		specificWhere.map(v => Object.assign(where, v))
	}
	const cond = {
		where,
	}
	return await models.user.findAndCountAll(cond)
		.catch(ex => {
			throw ex
		})
}

const deleteUser = async(req)=>{
	try {
		const user = await db.sequelize.transaction(async (t) =>{
			await models.user_roles.destroy({
				where:{id_user:req.params.id}
			},{transaction: t})
			await models.user.destroy({
				where:{id:req.params.id}
			},{transaction: t})
		})
		return user
	} catch (error) {
		return error
	}
}

const updatePassword = async(req)=>{
	console.log(req.body.password)
	return await models.user.update({
		password:bcrypt.hashSync(req.body.password, 8),
		updated_at:req.body.updated_at
	}
	,{
		where:{id:req.params.id}
	})
}

module.exports= {
	signup,
	signin,
	getRole,
	getAllUser,
	getAllRole,
	checkUser,
	checkEmail,
	getUserById,
	updateById,
	find,
	findData,
	deleteUser,
	updatePassword
}