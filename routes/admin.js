const express = require('express')
const router = express.Router()
const{
    createTranslator,
}
=require('../controllers/adminscontroller')

router.post('/createtranslator', createTranslator)


module.exports = router





