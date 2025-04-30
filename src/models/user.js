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
    }
},{timestamps:true})

const User = mongoose.model('User',username)
module.exports = User