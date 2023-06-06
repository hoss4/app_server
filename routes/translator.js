const express = require('express')
const router = express.Router()
const{
   
    addLanguage,
    //getLanguages,
    gettranslator,
    updateTranslator,
    resetpassword,
    gettranslationrequests,
    acceptrequest,
    rejectrequest,
    getoldtranslations,
    getupcomingtranslations,
    cancelrequest,
    removeLanguage,

}
=require('../controllers/translatorscontroller')


// router.get('/getlanguages/:id',getLanguages )
router.post('/addlanguage',addLanguage )
router.post('/gettranslator', gettranslator)
router.post('/updateTranslator', updateTranslator)
router.post('/resetpassword', resetpassword)
router.get('/gettranslationrequests', gettranslationrequests)
router.post('/acceptrequest', acceptrequest)
router.post('/rejectrequest', rejectrequest)
router.get('/getoldtranslations', getoldtranslations)
router.get('/getupcomingtranslations', getupcomingtranslations)
router.post('/cancelrequest', cancelrequest)
router.post('/removelanguage', removeLanguage)



module.exports = router