const express = require('express')
const {connectToDatabase} = require('./config/database')

const User = require('./models/user')
const {validateSignupData, validateSigninData} = require('./utils/validation') 
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const cors = require('cors')
const userRouter = require('./routes/user')

const app = express()

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
//      allowedHeaders: ['Content-Type', 'Authorization']
// }))

app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});


app.use(express.json()) 
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)





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
