const express = require('express')
const {connectToDatabase} = require('./config/database')
const mongoose = require('mongoose')
const User = require('./models/user')
const {validateSignupData, validateSigninData} = require('./utils/validation') 
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

const app = express()
app.use(express.json()) 
app.use(cookieParser())


app.use('/',authRouter)
app.use('/api',profileRouter)
app.use('/',requestRouter)





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
