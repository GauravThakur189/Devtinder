const express  = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userAuth = require('../middlewares/auth');

requestRouter.post('/request/send/:status/:userId',userAuth, async (req, res) => {
   try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        const allowedStatuses = ['pending', 'interested'];
        if(!allowedStatuses.includes(status)){
            return res.status(400).send('Invalid status', status)
        }

        if(fromUserId === toUserId){
            return res.status(400).send('You cannot send a connection request to yourself')
        }
        // const existingRequest = await ConnectionRequest.findOne({
        //     fromUserId,
        //     toUserId
        // })
        
        // const existingRequestTo = await ConnectionRequest.findOne({
        //     fromUserId: toUserId,
        //     toUserId: fromUserId
        // })
        // if(existingRequestTo){
        //     return res.status(400).send('Connection request already exists')
        // }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        
        if (existingRequest) {
            return res.status(400).send('Connection request already sent');
        }
        const user = await User.findById(toUserId)
        if(!user){
            return res.status(400).send('User not found')
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await connectionRequest.save()
        
        res.send(fromUserId)
   }catch(error){
       res.status(400).send("ERROR : "+error.message)
   }
})

requestRouter.post('/request/review/:status/:requestId',userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const requestId = req.params.requestId;

        const userId = req.user._id;


        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status', status);
        }

        const connectionRequest = await ConnectionRequest.findById(requestId);
        if (!connectionRequest) {
            return res.status(404).send('Connection request not found');
        }
        const fromUserId = connectionRequest.fromUserId;
        const toUserId = connectionRequest.toUserId;
        if (userId !== toUserId) {
            return res.status(403).send('You are not authorized to review this request');
        }
        if (connectionRequest.status !== 'pending') {
            return res.status(400).send('Connection request has already been reviewed');
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.send('Connection request reviewed successfully', { status });
        

        
    } catch (error) {
        res.status(400).send("ERROR : "+error.message)
        
    }
})

module.exports = requestRouter;
