const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");


/*  @desc       Auth user & get token
 *  @route      POST /api/users/login
 *  @access     Public
 */
router.post("/login", asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    //use custom created method matchPassword to check password validity
    if(user && (await user.matchPassword(password))) {
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }
        res.cookie("token", generateToken(responseData._id), { httpOnly: true }) //send the user id on token
        res.send(responseData)     
    } else {
        res.status(401)
        throw new Error("Invalid email or password.")
    }
}))


/*  @desc       authorize token from cookie
 *  @route      GET /api/users/authorize
 *  @access     Public
 */
router.get("/authorize", cookieJwtAuth, asyncHandler( async (req,res) => {
    const user = await User.findById(req.user.id);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    })
}))


/*  @desc       register/create a new user
 *  @route      GET /api/users/authorize
 *  @access     Public
 */
router.post("/register", asyncHandler( async (req,res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })    //check if user already exists

    if(userExists){
        res.status(400)
        throw new Error("User already exists.")
    }

    const user = await User.create({ name, email, password })

    if(user){  
        res.cookie("token", generateToken(user._id), { httpOnly: true }) //send the user id on token
        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data.")
    }

}))


module.exports = router