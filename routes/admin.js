const express = require('express')
const router = express.Router()
const{
         getadmin,
        updateAdmin,
        resetpassword,
        createTranslator ,
       createAdmin,
       getalltranslationrequests,
       gettranslators,
       AssignedRequest,
       getupcomingtranslations,
       getoldtranslations,
       CancelApp,
}
=require('../controllers/adminscontroller')

router.post('/getadmin', getadmin)
router.post('/updateAdmin', updateAdmin)
router.post('/resetpassword', resetpassword)
router.post('/createTranslator', createTranslator)
router.post('/createAdmin', createAdmin)
router.get('/getrequests', getalltranslationrequests)
router.post('/gettranslators', gettranslators)
router.post('/AssignedRequest', AssignedRequest)
router.get('/getupcomingtranslations', getupcomingtranslations)
router.get('/getoldtranslations', getoldtranslations)
router.post('/CancelApp', CancelApp)


module.exports = router





