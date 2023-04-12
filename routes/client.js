const express = require('express')
const router = express.Router()

const {
    createclient,
    updateclient,
    getclient,
    requesttranslation


}=require('../controllers/clientscontroller')

router.post('/createclient', createclient)
router.post('/updateclient/:id', updateclient)
router.post('/getclient', getclient)
router.post('/requesttrans/:id', requesttranslation)

module.exports = router