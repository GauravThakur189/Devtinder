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








Dear Gaurav,

I hope this message finds you well.

I am writing to express my keen interest in the Fullstack Developer position at FinStack. The culture of engineering excellence and strong fundamentals that you’ve cultivated deeply resonates with my own values as a developer.

I have experience building full-stack applications using Python (Flask/FastAPI), Node.js, React.js, and MongoDB. My foundation in computer science includes a strong understanding of object-oriented programming, data structures (especially maps, trees, and graphs), and problem-solving. I am also comfortable working with UNIX/Linux environments, writing clean, reusable code, and following design patterns.

I am highly motivated to learn, grow, and contribute in a fast-paced team of driven engineers. The idea of being mentored in a non-AI-dependent environment where fundamentals matter truly excites me.

Please find below the required details for my application:

1. Graduation Date: July 2022
2. Available to Join: Immediately
3. Current CTC/Offers: Not currently employed full-time
4. Expected CTC: INR 7.5–8.5 LPA (negotiable based on role and expectations)
5. Backend Experience: Python (Flask, FastAPI), Node.js, Express.js
6. Frontend Experience: React.js, HTML5, CSS3, TailwindCSS, basic knowledge of AngularJS and TypeScript
7. Resume & Portfolio: Attached to this email