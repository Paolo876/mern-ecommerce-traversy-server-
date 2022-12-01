const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
connectDB()
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
const app = express(); //init express
//netlify - heroku cookie fix
// app.set("trust proxy", 1)
app.enable("trust proxy")

require("dotenv").config();
app.use(cookieParser());
app.use(cors(
    {
        credentials: true, 
        // origin: process.env.ORIGIN || 'http://localhost:3000',  
        origin:  ["https://proshop-mern-traversy.netlify.app", "https://www.paolobugarinmernheroku.xyz", "http://localhost:3000"],
        allowedHeaders: true

}));    //to allow api connection from computer to react project
// app.use(cors({credentials: true, origin: '*' }));    //to allow api connection from computer to react project
app.use(express.json({ limit: "20mb" }));    // allow json data in req.body
//routes
app.get("/", (req,res) => res.send("APP IS ONLINE..."))
app.use("/api/products", require("./routes/products"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/users", require("./routes/auth"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/imagekit", require("./routes/imagekit"));

app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID)) //get route to send paypal client id to client
//custom errorhandling (middleware)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, async () => {
    console.log("running on port:".yellow.bold, port)
})