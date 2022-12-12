const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const generateToken = require("../utils/generateToken");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const UserAddresses = require("../models/userAddresses")
require("dotenv").config();

/*  @desc       Auth user & get token
 *  @route      POST /api/users/login
 *  @access     Public
 */
router.post("/login", asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() })
    //use custom created method matchPassword to check password validity
    if(user && (await user.matchPassword(password))) {
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin }
        res.cookie("token", generateToken(responseData._id), { secure: true, sameSite: "none", path:"/", domain: process.env.NODE_ENV === "local" ? "localhost": ".paolobugarin.com", httpOnly: true }) //send the user id on token
        res.send(responseData)
    } else {
        res.status(401)
        throw new Error("Invalid email or password.")
    }
}))


/*  @desc       authorize token from cookie
 *  @route      GET /api/users/authorize
 *  @access     Private
 */
router.get("/authorize", cookieJwtAuth, asyncHandler( async (req,res) => {
    const user = await User.findById(req.user.id);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        picture: user.picture,
        googleId: user.googleId,
    })
}))


/*  @desc       register/create a new user
 *  @route      GET /api/users/authorize
 *  @access     Public
 */
router.post("/register", asyncHandler( async (req,res) => {
    const userExists = await User.findOne({ email: req.body.email.toLowerCase() })    //check if user already exists

    if(userExists){
        res.status(400)
        throw new Error("User already exists.")
    }

    const user = await User.create({ ...req.body })

    if(user){  
        const token = generateToken(user._id)
        res.cookie("token", token, { secure: true, sameSite: "none", path:"/", domain: process.env.NODE_ENV === "local" ? "localhost": ".paolobugarin.com", httpOnly: true }) //send the user id on token
        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            googleId: user.googleId,
            isAdmin: user.isAdmin,
            token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data.")
    }
}))


/*  @desc       logout a user, send empty token
 *  @route      GET /api/users/logout
 *  @access     Public
 */
router.get("/logout", asyncHandler( async (req,res) => {
    res.cookie("token", 'none', { secure: true, sameSite: "none", path:"/", domain: process.env.NODE_ENV === "local" ? "localhost": ".paolobugarin.com", httpOnly: true , expires: new Date(Date.now() + 2 * 1000),})
    res
        .status(201)
        .send({ success: true, message: 'User logged out successfully' })

}))


/*  @desc       update user profile
 *  @route      PUT /api/users/update
 *  @access     Private
 */
router.put("/update", cookieJwtAuth, asyncHandler( async (req,res) => {
    const updates = req.body;
    if(updates.password) {
        const salt = await bcrypt.genSalt(10)
        updates.password = await bcrypt.hash(updates.password, salt)
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, returnOriginal: false });

    if(user){  
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(400)
        throw new Error("User not found.")
    }
}))


/*  @desc       get a user's profile by id
 *  @route      GET /api/users/profile/:id
 *  @access     Private
 */
router.get("/profile/:id", cookieJwtAuth, asyncHandler( async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user){  
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
            //additional information will be added here
        })
    } else {
        res.status(400)
        throw new Error("User not found.")
    }
}))


/*  @desc       save user shipping address
 *  @route      POST /api/users/add-address
 *  @access     Private
 */
router.post("/add-address", cookieJwtAuth, asyncHandler( async (req,res) => {
    let user = await UserAddresses.findOne({user: req.user.id})
    if(!user){
        user = await UserAddresses.create({
            user: req.user.id,
            addresses: [{ ...req.body }]  
        })
        res.status(200).json(req.body.addresses[0])
    } else {
        if(req.body.isDefault) user.addresses.forEach(item => { item.isDefault = false })   //set all addresses isDefault status to false 
        await user.addresses.push(req.body)
        await user.save()
        res.status(200).json(user.addresses.pop())
    }
}))


/*  @desc       get user's saved addresses
 *  @route      GET /api/users/address
 *  @access     Private
 */
router.get("/address", cookieJwtAuth, asyncHandler( async (req,res) => {
    try {
        let user = await UserAddresses.findOne({user: req.user.id})
        res.status(200).json(user && user.addresses || [])
    
    }catch(err){
        res.status(400)
        throw new Error("Failed to fetch data.")
    }
}))



module.exports = router