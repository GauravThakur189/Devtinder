const exppress = require('express');
const profileRouter = exppress.Router();
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {validateSignupData, validateSigninData} = require('../utils/validation')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const {connectToDatabase} = require('../config/database')

profileRouter.use(cookieParser())

profileRouter.get('/profile',async(req,res)=>{
    try{
        const cookie = req.cookies
        //console.log(cookie.token)
        const {token} = cookie
        if(!token){
            return res.status(401).send('Unauthorized')
        }
    const verify = jwt.verify(token,'secret')
    const {id}  = verify
    console.log("id of the user",id)
    const user = await User.findById(id)
    if(!user){
        return res.status(404).send('User not found')
    }
    
    res.send(user)}
    catch(error){
        res.status(400).send("ERROR : "+error.message)
    }
})

module.exports = profileRouter