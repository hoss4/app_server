const express = require('express')
const router = express.Router()
const{
   
    addLanguage,
    addLanguages,
    hasLanguage,
    getLanguages,

}
=require('../controllers/translatorscontroller')


router.patch('/addlanguage/:id',addLanguage )
router.patch('/addlanguages/:id',addLanguages )
router.get('/haslanguage/:id',hasLanguage )
router.get('/getlanguages/:id',getLanguages )


module.exports = router