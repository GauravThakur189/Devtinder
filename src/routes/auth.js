const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {validateSignupData, validateSigninData} = require('../utils/validation')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const {connectToDatabase} = require('../config/database')
const mongoose = require('mongoose')

authRouter.post('/signup', async(req,res)=>{
    // validation of data
    try{
      await  validateSignupData(req.body) 
      const user = req.body
      const {firstName,lastName,emailId,password} = user
      console.log(user)
      //encrypting the password
      const hashPassword  = await bcrypt.hash(password, 10)
      
       
    //creating the new instance of the user model
    const newUser = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword // Store the hashed password
    }) 
    
        await newUser.save(); 
        // or use a function to save the user to the database
        res.send('User created successfully')
    } catch(error){
        res.status(400).send(error.message)
        console.log('Error creating user',error.message);
        
    }
})

authRouter.post('/login', async(req,res)=>{
   
    try {
        //validateSigninData(req)
        const {emailId,password} = req.body
        const user = await User.findOne({emailId})
        if(!user){
            return res.status(400).send('User not found')
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id},'secret', {expiresIn:'1h'})
            res.cookie('token',token)
            res.send('Login successful')
            
        }else{
        return res.status(400).send('Invalid Password')
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.post('/logout',async(req,res)=>{
    try{
        res.clearCookie('token')
        res.send('Logout successful')
    }catch(error){
        res.status(400).send(error.message)
    }
})

module.exports = authRouter