const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const adminSchema = new Schema({
    
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
    acceptedrequests: {
        type: [String],
        required: false,
    }, 

}, {timestamps : true} )

adminSchema.set(
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
adminSchema.plugin(uniqueValidator,{message:'Email already exists'});

module.exports = mongoose.model('Admin', adminSchema)