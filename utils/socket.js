const socket = require('socket.io')

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
        socket.on('sendMessage', ({firstName,userId,targetUserId,text})=>{
           
             const roomId  = [userId,targetUserId].sort().join('_')
                console.log(firstName,'sent message to',roomId,"with text",text)
             io.to(roomId).emit('receiveMessage',{firstName,text})
        })
        socket.on('disconnect', ()=>{
            console.log('user disconnected')
        })
    })

}

module.exports = initializeSocket;