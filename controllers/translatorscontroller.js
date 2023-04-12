const Translator= require('../models/Translator')

   


// add language to translator
const addLanguage = async (req, res) => {
    try{
        const translator = await Translator.findById(req.params.id)
        const language = req.body.language
        translator.languages.push(language)
        const updatedTranslator = await translator.save()
        res.status(200).json(updatedTranslator)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

const addLanguages = async (req, res) => {
    try{
        const translator = await Translator.findById(req.params.id)
        const languages = req.body.languages
        translator.languages.push(...languages)
        const updatedTranslator = await translator.save()
        res.status(200).json(updatedTranslator)
    }catch(err){
        res.status(400).json({message: err.message})
    }   
}
// check if translator has a language

const hasLanguage = async (req, res) => {
    try{
        const translator = await Translator.findById(req.params.id)
        const language = req.body.language
        const hasLanguage = translator.languages.includes(language)
        res.status(200).json(hasLanguage)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

const getLanguages = async (req, res) => {
    try{
        const translator = await Translator.findById(req.params.id)   
        res.status(200).json(translator.languages)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}







module.exports = {  
   
    addLanguage,
    addLanguages,
    hasLanguage,
    getLanguages,
}      
