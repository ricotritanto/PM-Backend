'use strict'
require('dotenv').config()
const excelReader = require('../util/excelReader')
const uploadFileRepo = require('../repository/uploadLog')
const productRepo = require('../repository/productsRepo')
const customerRepo = require('../repository/customerRepo')
const deliveryOrderRepo = require('../repository/deliveryRepo')
const invoiceRepo = require('../repository/invoiceRepo')

const uploadData = async (fileName, fileType) => {
	const logData = await uploadFileRepo.getByName(fileName)
	// console.log(JSON.stringify(logData))
	if (logData == null){
		console.log('data ra ketemu boskuuu')
		return
	}
	switch(fileType) {
	case 'products':
		await uploadProduct(fileName, fileType, logData.id)
		break
	case 'customers':
		await uploadCustomer(fileName, fileType, logData.id)
		break
	case 'deliveryOrder':
		await uploadDO(fileName, fileType, logData.id)
		break
	case 'invoice':
		await uploadInvoice(fileName, fileType, logData.id)
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
			// console.log(JSON.stringify(element))
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

const uploadCustomer = async(fileName, fileType, id) =>
{
	try {
		const result = await excelReader.readExcelFileSingleSheet(process.env.FULL_FILEPATH+'/'+fileName, fileType)
		let isHeader = false
		let bulkValue = []
		result.returnValue.forEach(element => {
			// console.log(JSON.stringify(element))
			if(isHeader == true){
				if(element.length != 4){
					uploadFileRepo.update('FAILED', id)
					return            
				}else{
					bulkValue.push({
						name: element[0],
						alias: element[1],
						address: element[2],
						phone: element[3]
					})
				}
			}else isHeader = true
		})
		// console.log(bulkValue)
		await customerRepo.insertBulk(bulkValue)
		await uploadFileRepo.update('PROCESSED', id)
		
	} catch (error) {
		uploadFileRepo.update('FAILED', id)
	}
}

const uploadDO = async(fileName, fileType, id) =>
{
	try {
		const result = await excelReader.readExcelFileSingleSheet(process.env.FULL_FILEPATH+'/'+fileName, fileType)
		let isHeader = false
		let bulkValue = []
		result.returnValue.forEach(element => {
			if(isHeader == true){
				if(element.length != 6){
					uploadFileRepo.update('FAILED', id)
					return            
				}else{
					bulkValue.push({
						customers: element[0],
						products: element[1],
						buying_price: element[2],
						selling_price: element[3],
						qty: element[4],
						delivery_order_date: element[5]
					})
				}
			}else isHeader = true
		})
		let tampungBulk =[]
		bulkValue.forEach(async(element) =>{
			tampungBulk.push({
				customers:element.customers,
				products: element.products,
				buying_price: element.buying_price,
				selling_price: element.selling_price,
				qty: element.qty,
				delivery_order_date: element.delivery_order_date
			})
		})
		let deliveryOrder = []
		let customerId = []
		let productId=[]
		let deliveryOrderItem = []
		let cekData = []

		for(var i=0; i< bulkValue.length;i++) {
			customerId[i]= await customerRepo.findCustomer(tampungBulk[i])
			productId[i] = await productRepo.findProduct(tampungBulk[i])
			if(!customerId[i].id || !productId[i].id){	
				await uploadFileRepo.update('FAILED', id)	
				return
			}
			else{
				deliveryOrder.push({
					customer_id:customerId[i].id,
					delivery_order_date: tampungBulk[i].delivery_order_date,
					product_id:productId[i].id
				})
			}
		}
		var dataDO = deliveryOrder,
			unique = dataDO.filter((set => f => !set.has(f.customer_id) && set.add(f.customer_id))(new Set))

		// console.log(unique)
		// console.log(unique.length)
		let idDO = []
		for(var x=0; x< dataDO.length;x++) {
			cekData[x]= await deliveryOrderRepo.findByOne(dataDO[x])
			console.log(cekData)
			if(cekData[x]==null){
				await deliveryOrderRepo.insertBulkDO(dataDO)
				deliveryOrderItem.push({
					deliveryOrder_id:cekData[x].id,
					product_id:productId[x].id,
					buying_price: tampungBulk[x].buying_price,
					selling_price: tampungBulk[x].selling_price,
					qty: tampungBulk[x].qty
				})
			}			
			else{
				idDO[x] = await deliveryOrderRepo.findProduct(cekData[x], dataDO[x])
				if(idDO[x]==null){
					deliveryOrderItem.push({
						deliveryOrder_id:cekData[x].id,
						product_id:productId[x].id,
						buying_price: tampungBulk[x].buying_price,
						selling_price: tampungBulk[x].selling_price,
						qty: tampungBulk[x].qty
					})
				}
			}
		}
		await deliveryOrderRepo.insertBulk(deliveryOrderItem)
		await uploadFileRepo.update('PROCESSED', id)
		
	} catch (error) {
		uploadFileRepo.update('FAILED', id)
	}
}

const uploadInvoice = async(fileName, fileType, id) =>
{
	try {
		const result = await excelReader.readExcelFileSingleSheet(process.env.FULL_FILEPATH+'/'+fileName, fileType)
		let isHeader = false
		let bulkValue = []
		result.returnValue.forEach(element => {
			if(isHeader == true){
				if(element.length != 4){
					uploadFileRepo.update('FAILED', id)
					return            
				}else{
					bulkValue.push({
						customers: element[0],
						dispentation: element[1],
						amount: element[2],
						invoice_date: element[3]
					})
				}
			}else isHeader = true
		})
		let tampungBulk =[]
		bulkValue.forEach(async(element) =>{
			tampungBulk.push({
				customers:element.customers,
				dispentation: element.dispentation,
				amount: element.amount,
				invoice_date: element.invoice_date,
			})
		})
		let invoice = []
		let customerId = []
		for(var i=0; i< bulkValue.length;i++) {
			customerId[i]= await customerRepo.findCustomer(tampungBulk[i])
			if(!customerId[i].id){	
				await uploadFileRepo.update('FAILED', id)	
				return
			}
			else{
				invoice.push({
					customer_id:customerId[i].id,
					dispentation: tampungBulk[i].dispentation,
					amount: tampungBulk[i].amount,
					invoice_date: tampungBulk[i].invoice_date
				})
			}
		}
		const dataInvoice = []
		for(var k=0; k< invoice.length;k++) {
			dataInvoice[k] = await invoiceRepo.findID(invoice[k])
			if(dataInvoice[k] == null){			
				await invoiceRepo.insertBulk([invoice[k]])
				await uploadFileRepo.update('PROCESSED', id)
				return
			}
			else{
				await uploadFileRepo.update('FAILED', id)
			}
		}
		
	} catch (error) {
		uploadFileRepo.update('FAILED', id)
	}
}
module.exports = {
	uploadData
}