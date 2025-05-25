const express = require('express')
const userAuth = require('../middlewares/auth')
const Chat = require('../models/socket')

const chatRouter = express.Router()

chatRouter.get('/chat/:targetUserId',userAuth,async(req,res)=>{
    try {
        const targetUserId = req.params.targetUserId
    const userId = req.user._id
    let chat = await Chat.findOne({participants:{$all:[userId,targetUserId]}})
    .populate({
        path: 'messages.senderId',
        select: 'firstName lastName'
    })
    if(!chat){
      chat = new Chat({
        participants: [userId,targetUserId],
        messages: []
      })
    }
    await chat.save()
    res.json(chat)
    } catch (error) {
        console.log("error in fetching chat",error);    
    }
    
})

module.exports = chatRouter

