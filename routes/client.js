const express = require('express')
const router = express.Router()

const {
    resetpassword,
    updateclient,
    getclient,
    requesttranslation,
    gettranslationrequests,
    deleterequest,
    getoldtranslations,
    getupcomingtranslations,
    CancelApp,
    
} = require('../controllers/clientscontroller')


router.post('/updateclient', updateclient)
router.post('/getclient', getclient)
router.post('/resetpassword', resetpassword)
router.post('/requesttrans', requesttranslation)
router.get('/getreq', gettranslationrequests)
router.post('/deleteReq', deleterequest)
router.get('/getoldtranslations', getoldtranslations)
router.get('/getupcomingtranslations', getupcomingtranslations)
router.post('/CancelApp', CancelApp)


module.exports = router