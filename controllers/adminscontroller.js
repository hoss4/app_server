const Admin = require('../models/Admin')
const Translator= require('../models/Translator')



const createTranslator = async (req, res) => {

    try{
     
        const translator = await Translator.create({
            email: req.body.email,
            password: req.body.password,
            backupemail: req.body.backupemail,
            name: req.body.name
        })
        res.status(200).json(translator)
    }catch(err){
        res.status(400).json({message: err.message})
    }
    }


    module.exports = {  
        createTranslator ,
     
    }      
    