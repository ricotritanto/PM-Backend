// var fs = require('fs')
// var uploadFile = function(req) {
// 	console.log(req.file)
// 	return new Promise((resolve) => {
// 		var outStream = fs.createWriteStream(('./resources/assets/upload/')+req.file.originalname)
// 		outStream.write(req.file.buffer)
// 		outStream.end()
// 		outStream.on('finish', function () {
// 			resolve('uploaded')
// 		})
// 	})
// }

// module.exports = uploadFile
const multer = require('multer')

const excelFilter = (req, file, cb) => {
	if (
		file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml')
	) {
		cb(null, true)
	} else {
		cb('Please upload only excel file.', false)
	}
}

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname + '/../../resources/assets/upload/')
	},
	filename: (req, file, cb) => {
		// console.log(file.originalname);
		let resultnya = `${Date.now()}-fileupload-${file.originalname}` 
		cb(null, resultnya)
	}, 
})
// return asw
var uploadFile = multer({ storage: storage, fileFilter: excelFilter })

module.exports = uploadFile

