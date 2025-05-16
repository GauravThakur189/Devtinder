const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE_DATA)
  //     .populate("toUserId", USER_SAFE_DATA);
  //   const data = connectionRequest.map((row) => {
  //     if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
  //       return row.toUserId;
  //     } else return row.fromUserId;
  //   });
  //   console.log("connection request ", connectionRequest);
    
  //  console.log("connection request data", data);
   //console.log("connection request ", connectionRequest);
   
    res.json({
      data: connectionRequest,
      message: "Data fetched successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
       
    }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA); 
      
    if (!connectionRequest) {
      return res.status(400).send("No connections found");
    }
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
       return row.fromUserId;
    })
    
    
    
    res.json({
      message: "Data fetched successfully",
       data,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;
//     console.log("logged in user", loggedInUser);
//     const page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//     limit = limit > 50 ? 50 : limit; // Limit the maximum number of results to 100
//     const skip = (page - 1) * limit;
//     const connectionRequest = await ConnectionRequest.find({
//       $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
//     }).select("fromUserId toUserId");
//     console.log("connection request", connectionRequest);
//     const hideUsersFromFeed = new Set();
//     // connectionRequest.forEach(()=>{
//     //     hideUsersFromFeed.add(connectionRequest.fromUserId._id.toString())
//     //     hideUsersFromFeed.add(connectionRequest.toUserId._id.toString())

//     // })
//     connectionRequest.forEach((req) => {
//       if (req.fromUserId) hideUsersFromFeed.add(req.fromUserId.toString());
//       if (req.toUserId) hideUsersFromFeed.add(req.toUserId.toString());
//     });

//     console.log(hideUsersFromFeed);
//     const users = await User.find({
//       $and: [
//         {
//           _id: {
//             $nin: Array.from(hideUsersFromFeed).map(
//               (id) => new mongoose.Types.ObjectId(id)
//             ),
//           },
//         },
//         { _id: { $ne: loggedInUser._id } },
//       ],
//     })
//       .select(USER_SAFE_DATA)
//       .skip(skip)
//       .limit(limit);
//     if (!users) {
//       return res.status(400).send("No users found");
//     }
//     res.send(users);
//   } catch (error) {
//     res.status(400).send("ERROR : " + error.message);
//   }
// });



userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser || !loggedInUser._id) {
      return res.status(400).send("Logged-in user not found.");
    }

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, 50); // enforce upper limit of 50
    const skip = (page - 1) * limit;

    // Step 1: Get all related connection requests
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Step 2: Collect all user IDs to hide from feed
    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      if (req.fromUserId) hideUsersFromFeed.add(req.fromUserId.toString());
      if (req.toUserId) hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Also hide the logged-in user themselves
    hideUsersFromFeed.add(loggedInUser._id.toString());

    // Step 3: Query users NOT in hide list
    const users = await User.find({
      _id: {
        $nin: Array.from(hideUsersFromFeed).map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    // // Logging for debug
    // console.log("Hide list:", Array.from(hideUsersFromFeed));
    // console.log("Returned users count:", users.length);

    res.status(200).json(users);
  } catch (error) {
    console.error("Feed error:", error);
    res.status(400).send("ERROR: " + error.message);
  }
});


userRouter.get("/user/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userAuth;
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Please provide a user id");
    }
    if (loggedInUser._id.toString() === id) {
      return res.status(400).send("You cannot view your own profile");
    }
    const user = await User.findById(id).select(USER_SAFE_DATA);
    if (!user) {
      return res.status(400).send("User not found");
    }
    res.json({
      message: "Data fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});


module.exports = userRouter;
