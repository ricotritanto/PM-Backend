const productRepo = require('../repository/productRepo')
const {check, validationResult} = require('express-validator')
const readXlsxFile = require('read-excel-file/node')

module.exports ={
    async getAllProducts(req,res){   
        try {
            const products = await productRepo.getAll(req,res)
            res.status(200).send(products)
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    },

    async getByID(req, res){
        try {
            const result = await productRepo.getById(req)
            res.status(200).send({
                messgae: 'data berhasil diambil',
                data:result
            })
        
        } catch (error) {
            res.status(500).send({
				message:
                error.message || 'Some error occurred while update the customers!'
			})
        }
    },

    async create(req, res){
        try {
            await check('name','name is required!').notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() })
            }
            await productRepo.create(req)
			res.status(201).send({message:'product name created successfully!'})

        } catch (error) {
            res.status(500).send({
            message:
            error.message || 'Some error occurred while update the name!'
			})
        }
    },

    async update(req, res) {
        await check('name','name is required!').notEmpty().run(req)
		const result = validationResult(req)
		if (!result.isEmpty()) {
			return res.status(400).json({ errors: result.array() })
		}
		try {
			await productRepo.update(req)
			res.status(200).send({message:'product name updated successfully!'})
		} catch (error) {
			res.status(500).send({
				message:
                error.message || 'Some error occurred while update the product!'
			})
		}
    },

    async delete(req, res){
        try {
            await productRepo.delete(req)
            res.status(200).send({
                message:'Data berhasil dihapus.'
            })
        } catch (error) {
            res.status(500).send({
				message:
                error.message || 'Some error occurred while delete the product!'
			})
        }
    }
}