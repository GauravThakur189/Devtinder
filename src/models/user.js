const mongoose = require('mongoose');
const validator = require('validator');

const username = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 20,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('First name must contain only letters')
            }
        }
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        maxLength:20,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('Last name must contain only letters')
            }
        }

    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is weak')
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        enum:{
            values: ["male","female","other"],
            message: '{VALUE} is not valid gender'
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Photo URL is invalid')
            }
        }
    },
    about:{
        type:String,
        trim:true,
        default:'This is the default about of the user',
        maxLength:500,
    },
    skills:{
        type:[String],
        maxLength:10,
        validate(value){
            if(value.length > 10){
                throw new Error('Skills should not be more than 10')
            }
        }
    }
},{timestamps:true})

const User = mongoose.model('User',username)
module.exports = User