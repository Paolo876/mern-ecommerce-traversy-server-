const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");

connectDB();
const app = express(); //init express
require("dotenv").config();
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));    //to allow api connection from computer to react project
app.use(express.json());    // allow json data in req.body

//routes
app.get("/", (req,res) => res.send("APP IS ONLINE..."))
app.use("/api/products", require("./routes/products"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/users", require("./routes/auth"))

//custom errorhandling (middleware)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => console.log("running on port:".yellow.bold, port))