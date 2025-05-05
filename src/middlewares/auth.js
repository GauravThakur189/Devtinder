const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Assuming you're using cookies to store the token
        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        const decoded = await jwt.verify(token, 'secret'); // Replace 'secret' with your actual secret key
        const user = await User.findById(decoded.id); // Assuming the token contains the user ID

        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user; // Attach the user to the request object for later use
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).send('Unauthorized: Invalid token');
    }
};

module.exports = userAuth;