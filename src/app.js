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

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
     allowedHeaders: ['Content-Type', 'Authorization']
}))
// app.options('*', cors());

app.use(express.json()) 
app.use(cookieParser())


// Set up CORS properly
// app.use(cors({
//   origin: true, // Allow the requesting origin
//   credentials: true, // Allow cookies to be sent/received
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }))

// Or if you need to be more specific about origins:

// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }))


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
