const uploadLogRepo = require('../repository/uploadLogRepo')
const customerRepo = require('../repository/CustomerRepo')
const productRepo = require('../repository/ProductRepo')
const {check, validationResult} = require('express-validator')
const readXlsxFile = require('read-excel-file/node')
var fs = require('fs')
// const path = require('path')
const uploadFile = require('../middlewares/upload')

module.exports ={
    async upload(req, res){
        try{
            // process -> upload file -> file sukses upload di local -> insert log upload_log -> select file local yg belum terupload -> insert di table customer or products

            // let filetype = 'products'
            if(req.file == undefined){
                return res.status(400).send('please upload an file excel!')
            }
            var statuse = ((req.file.filename == undefined)? 'failed': 'processed')
            const uploaddata = await uploadLogRepo.create(req,statuse)
            // return;
            let path =__basedir + "/resources/assets/upload/"+req.file.filename
            let dir = __basedir + "/resources/assets/upload/"
            let filenames = fs.readdirSync(dir) //get filename path local
            // console.log(filenames)
            // return;
            readXlsxFile(path).then((rows) =>{
                rows.shift()
                let dataProducts = []
                let dataCustomers = []
                let dataInvoice = []
                let dataMaster = []
                // di ifelse data yang akan diupload ke DB berdasarkan filetype nya
                // console.log(req.body.filetype)
                // return;
                let idUpload = uploaddata.id
                // var statusnya = 'uploaded'
                // var statusFail= 'failed'
                
                var statusnya ='';
                async function uploadData(){
                    try {                        
                        statusnya='uploaded'
                        if(req.body.filetype == 'products')
                        {
                            rows.forEach((row)=>{
                                let dataProduct= {
                                    name : row[0],
                                    alias: row[0],
                                    phone:row[0]
                                }
                                dataProducts.push(dataProduct)
                            })
                                const result = await productRepo.upload(dataProducts)
                        } 
                        else if(req.body.filetype == 'customers')
                        {                    
                                rows.forEach((row)=>{
                                let dataCustomer= {
                                    name : row[0],
                                    alias: row[0],
                                    address: row[0],
                                    phone:row[0]
                                }
                                dataCustomers.push(dataCustomer)
                            })
                                const result = await customerRepo.upload(dataCustomers)                          
                        }
                        else if(req.body.filetype == 'invoice'){

                        }else{
                            console.log('maaf type upload harus dipilih.')
                        }
                        
                        let uploadLog = uploadLogRepo.updateUpload(idUpload,statusnya)
                        res.status(200).send({
                            status: 'success',
                            message : "uploaded the file successfully." +req.file.originalname,
                            data:uploadLog
                        }) 
                    } catch (error) {
                        statusnya='failed'
                        console.log(error)
                        return  uploadLogRepo.updateUpload(idUpload,statusnya)
                    }
                }
                uploadData()
            })
        }catch(error){
            console.log(error)
            res.status(500).send({
                message: 'couldnot upload the file'
            })
        }
    }
}