const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const translatorSchema = new Schema({
    
    username: { 
        type: String,
        required: true,
        },
    password: { 
        type: String,
        required: true,
            },
    email: { 
        type: String,
        required: true,
        unique: true
            },
    name: {
        type: String,
        required: true,
    },
    languages: {
        type: [String],
        required: false,
        default: [],
    },   
    reqtrans: {
        type: [{type: mongoose.Types.ObjectId, ref:'RequestedTranslations'}],
        required: false,
        default: [],
    }, 
    schedtrans: {
        type: [String],
        required: false,
        default: [],
    }, 

}, {timestamps : true} )

translatorSchema.set(
    'toJSON',
    {
        transform:(document, returnedObject)=> {
        returnedObject.id = returnedObject._id.toString();
        //returnedObject.type = "client";
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        },
    }
)
translatorSchema.plugin(uniqueValidator,{message:'Email already exists'});


module.exports = mongoose.model('Translator', translatorSchema)