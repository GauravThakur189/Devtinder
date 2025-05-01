const express = require('express')
const {connectToDatabase} = require('./config/database')
const mongoose = require('mongoose')
const User = require('./models/user')
const {validateSignupData, validateSigninData} = require('./utils/validation') 
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json()) 
app.use(cookieParser())

app.post('/signup', async(req,res)=>{
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

app.post('/login', async(req,res)=>{
   
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

app.get('/profile',async(req,res)=>{
    try{
        const cookie = req.cookies
        const {token} = cookie
        if(!token){
            return res.status(401).send('Unauthorized')
        }
    const verify = jwt.verify(token,'secret')
    const {_id}  = verify
    console.log(_id)
    const user = await User.findById(_id)
    if(!user){
        return res.status(404).send('User not found')
    }
    
    res.send(user)}
    catch(error){
        res.status(400).send("ERROR : "+error.message)
    }
})


const DatabaseConnection = async()=>{
    const connection = await connectToDatabase()
    if(!connection){
        console.error('Failed to connect to the database')
         process.exit(1)// Exit the process with failure
    } else {
        app.listen(3000,connectToDatabase,()=>{
            console.log('Server is running on port 3000')
        })
        
        console.log('Connected to the database successfully')
    }
}

DatabaseConnection()
