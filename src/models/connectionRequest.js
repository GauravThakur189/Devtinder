const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type: String,
        enum: ['pending','interested', 'accepted', 'rejected'],
        default: 'pending',
    },
},{timestamps:true});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;