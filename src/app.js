const express = require('express')
const {connectToDatabase} = require('./config/database')
const mongoose = require('mongoose')

const app = express()
app.use(express.json()) // Middleware to parse JSON bodies

app.post('/signup', async(req,res)=>{
    // validation of data



    // creating a new instance of a User model
    const user = req.body
    console.log(user)
    try{
        await user.save(); // Assuming user is a Mongoose model instance
        // or use a function to save the user to the database
        res.send('User created successfully')
    } catch(error){
        res.status(400).send('Error creating user')
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
