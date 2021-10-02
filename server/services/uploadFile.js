'use strict'
require('dotenv').config()
const excelReader = require('../util/excelReader')
const uploadFileRepo = require('../repository/uploadLog')
const productRepo = require('../repository/products')

const uploadData = async (fileName, fileType) => {
	const logData = await uploadFileRepo.getByName(fileName)
	console.log(JSON.stringify(logData))
	if (logData == null){
		console.log('data ra ketemu boskuuu')
		return
	}
	switch(fileType) {
	case 'products':
		await uploadProduct(fileName, fileType, logData.id)
		break
	case 'customers':
		// code block
		break
	default:
		uploadFileRepo.update('FAILED', logData.id)
	}
	
}

const uploadProduct = async (fileName, fileType, id) => {
	try {
		const result = await excelReader.readExcelFileSingleSheet(process.env.FULL_FILEPATH+'/'+fileName, fileType)
		let isHeader = false
		let bulkValue = []
		result.returnValue.forEach(element => {
			console.log(JSON.stringify(element))
			if(isHeader == true){
				if(element.length != 2){
					uploadFileRepo.update('FAILED', id)
					return            
				}else{
					bulkValue.push({
						name: element[0],
						alias: element[1]
					})
				}
			}else isHeader = true
		})
		await productRepo.insertBulk(bulkValue)
		await uploadFileRepo.update('PROCESSED', id)
	} catch (error) {
		uploadFileRepo.update('FAILED', id)
	}
	
}

module.exports = {
	uploadData
}