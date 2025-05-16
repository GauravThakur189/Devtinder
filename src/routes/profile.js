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
    //console.log("id of the user",id)
    const user = await User.findById(id)
    if(!user){
        return res.status(404).send('User not found')
    }
    
    res.send(user)}
    catch(error){
        res.status(400).send("ERROR : "+error.message)
    }
})

profileRouter.patch('/edit/profile',async(req,res)=>{
    try{
         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        const cookie = req.cookies
        const {token} = cookie
        if(!token){
            return res.status(401).send('Unauthorized')
        }
        const verify = jwt.verify(token,'secret')
        const {id}  = verify
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send('User not found')
        }
        const {firstName,lastName,photoUrl,age,gender,about} = req.body
        if(!firstName || !lastName || !photoUrl || !age || !gender || !about){
            return res.status(400).send('Please provide all the fields')
        }
        const updatedUser = await User.findByIdAndUpdate(id,{
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about
        },{new:true})
        if(!updatedUser){
            return res.status(404).send('User not found')
        }
        res.json({
            message:'User updated successfully',
            data:updatedUser
        })
    }
    catch(error){
        res.status(400).send("ERROR : "+error.message)
    }
}
    )

module.exports = profileRouter