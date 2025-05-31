const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectToDatabase = async () => {
    console.log('Connecting to database...');
    const DB_URI = "mongodb+srv://rajanthakur1818:H9X7LYyRFXXYYQj7@cluster0.ihxzqzl.mongodb.net/devTinder" // Default to local MongoDB if no URI is provided
    
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
        return true
    } catch (error) {
        console.error('Database connection error:', error);
        return false
    }
}



module.exports = {
    connectToDatabase,
    
}