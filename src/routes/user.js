const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const  userAuth  = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

userRouter.post('/user/request/received', userAuth, async (req, res) => {   
    try {
        const loggedInUser = req.userAuth
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA)
        const data  = connectionRequest.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            else return row.fromUserId
        } );

        res.json({ 
            data : data
        })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

userRouter.get('/user/connections',userAuth, async (req, res) => {
    try {
        const loggedInUser = req.userAuth
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id ,status: 'accepted' }
            ],
            status: 'accepted'
        }).populate('fromUserId', 'firstName lastName email photoUrl age skills')
        if (!connectionRequest) {
            return res.status(400).send('No connections found')
        }
        res.json({
            message : "Data fetched successfully",
            data : connectionRequest
        })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

userRouter.get('/feed',userAuth, async (req, res) => {
    try {
        const loggedInUser = req.userAuth

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit  = limit > 50 ? 50 : limit; // Limit the maximum number of results to 100
        const skip = (page - 1) * limit;


        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id  }
            ],}).select('fromUserId toUserId')
        const hideUsersFromFeed =  new Set();
        connectionRequest.forEach(()=>{
            hideUsersFromFeed.add(connectionRequest.fromUserId._id.toString())
            hideUsersFromFeed.add(connectionRequest.toUserId._id.toString())

        })
        console.log(hideUsersFromFeed);
        const users = await User.find({
           $and:[{ _id: { $nin: Array.from(hideUsersFromFeed) }},
           { _id: { $ne: loggedInUser._id }}],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        if (!users) {
            return res.status(400).send('No users found')
        }
        res.send(users)
        
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

module.exports = userRouter;