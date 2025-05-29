const socket = require('socket.io')
const Chat = require('../src/models/socket')

const initializeSocket = (server) => {
 const io = socket(server,{
    cors:{
        origin:'http://localhost:5173',
    }
 })
    io.on('connection', (socket)=>{
        console.log('a new client connected')
        socket.on('joinChat',({firstName,userId,targetUserId})=>{
           const roomId = [userId,targetUserId].sort().join('_')
           console.log(firstName,'joined roomId',roomId)
            socket.join(roomId)
            
        })
        socket.on('sendMessage', async({firstName,lastName,userId,targetUserId,text})=>{
            try {
                const roomId  = [userId,targetUserId].sort().join('_')
                console.log(firstName,'sent message to',roomId,"with text",text)
                let chat =await Chat.findOne({
                   participants: {$all:[userId,targetUserId]},
                })
                if(!chat){
                     chat = new Chat({
                        participants:[userId,targetUserId],
                        messages:[]
                            })
                        } 
                        chat.messages.push({
                            senderId:userId,
                            text:text,
                        })    
                await chat.save()
                 io.to(roomId).emit('receiveMessage',{firstName,lastName,text})
            } catch (error) {
                console.log("error in savong message",error);    
            }
           
             
            
        })
        socket.on('disconnect', ()=>{
            console.log('user disconnected')
        })
    })

}

module.exports = initializeSocket;








