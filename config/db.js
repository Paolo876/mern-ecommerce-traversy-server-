const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI)
        mongoose.set('bufferCommands', false);
        console.log("mongodb connected:".cyan.underline.bold, db.connection.host)
    } catch (error) {
        console.log("error:".red.underline.bold, error.message)
    }
}

module.exports = connectDB;