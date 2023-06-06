const mongoose = require('mongoose')

const Schema = mongoose.Schema

const acceptedreqschema = new Schema({
    
    clientid: {
        type: mongoose.Types.ObjectId,
        ref:'Client',
        required: true,
    },
   fromlang: {
         type: String,
         required: true,
        },
    tolang: {
        type: String,
        required: true,
    },
    onthephone: {
        type: Boolean,
        required: true,
    },
    inperson: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
  
    translatorid: {
        type: mongoose.Types.ObjectId,
        ref:'Translator',
        required: true,
    },
    created: {
        type: Date,
        required: true,
    } 


}, {timestamps : true} )


module.exports = mongoose.model('AcceptedRequests', acceptedreqschema)