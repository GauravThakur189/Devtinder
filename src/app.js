const express = require('express')

const app = express()

app.use((req,res)=>{
    res.send("Hello gaurav")
})

app.listen(3000)