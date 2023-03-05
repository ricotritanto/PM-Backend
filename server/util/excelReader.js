const ExcelJS = require('exceljs')

const readExcelFileSingleSheet = async (path,sheetName) => {
	try {
		const workbook = new ExcelJS.Workbook()
		const wb = await workbook.xlsx.readFile(path)
		const ws = wb.getWorksheet(sheetName)
		// console.log(wb)
		let totalRow = 0
		let maxColumn = 0
		let returnValue = []
		ws.eachRow({ includeEmpty: false }, function(row) {
			totalRow++
			if(maxColumn < row.values.length) maxColumn = row.values.length -1
			const velidateValue = JSON.parse(JSON.stringify(row.values))
			let isStart = false
			let eachRow = []
			velidateValue.forEach(val=>{
				if(isStart == true){
					eachRow.push(val)
				}else isStart = true
			})
			returnValue.push(eachRow)
		})
		return {
			totalRow,
			maxColumn,
			returnValue
		}
	} catch (error) {
		return new Error('fail to read excel file')
	}

}

module.exports = {
	readExcelFileSingleSheet
}