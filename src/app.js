const express = require('express')
const {connectToDatabase} = require('./config/database')
const mongoose = require('mongoose')
const User = require('./models/user')
const {validateSignupData, validateSigninData} = require('./utils/validation') 
const bcrypt = require('bcryptjs')
const app = express()
app.use(express.json()) /

app.post('/signup', async(req,res)=>{
    // validation of data
    try{
      await  validateSignupData(req.body) 
      const user = req.body
      const {firstName,lastName,emailId,password} = user
      console.log(user)
      //encrypting the password
      const hashPassword  = await bcrypt.hash(password, 10)
       console.log(hashPassword);
       
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
        if(!isMatch){
            return res.status(400).send('Invalid Password')
        }
        res.send('Login successful')

    } catch (error) {
        res.status(400).send(error.message)
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
