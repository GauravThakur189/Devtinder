const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.post('/user/request/received', userAuth, async (req, res) => {   
    try {
        const loggedInUser = req.userAuth
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName email photoUrl age skills')
        if (!connectionRequest) {
            return res.status(400).send('No connection requests found')
        }
        res.json({
            message : "Data fetched successfully",
            data : connectionRequest
        })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})



module.exports = userRouter;