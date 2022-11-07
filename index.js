const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
require("dotenv").config();

connectDB();
const app = express(); //init express
app.use(cors());    //to allow api connection from computer to react project
app.use(express.json());

//routes
app.get("/", (req,res) => res.send("APP IS ONLINE..."))
app.use("/api/products", require("./routes/products"))

//custom errorhandling (middleware)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => console.log("running on port:".yellow.bold, port))