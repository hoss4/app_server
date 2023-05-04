const express = require('express')
const router = express.Router()

const {
    resetpassword,
    updateclient,
    getclient,
    requesttranslation,
    gettranslationrequests,
    deleterequest


} = require('../controllers/clientscontroller')


router.post('/updateclient', updateclient)
router.post('/getclient', getclient)
router.post('/resetpassword', resetpassword)
router.post('/requesttrans', requesttranslation)
router.get('/getreq', gettranslationrequests)
router.post('/deleteReq', deleterequest)

module.exports = router