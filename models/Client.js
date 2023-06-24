const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const clientSchema = new Schema({
    
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
    passwordResetCode:{
        type: Number,
        required: false,
        default: -1
    },

}, {timestamps : true} )

clientSchema.set(
    'toJSON',
    {
        transform:(document, returnedObject)=> {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.passwordResetCode;
       
        },
    }
)
clientSchema.plugin(uniqueValidator,{message:'Email already exists'});



module.exports = mongoose.model('Client', clientSchema)