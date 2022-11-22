const express = require("express");
const asyncHandler = require("express-async-handler");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();
const User = require("../models/userModel");


/*  @desc       Get all users
 *  @route      GET /api/admin/get-users
 *  @access     Private/Admin
 */
router.get("/get-users", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const users = await User.find({}).select("-password");
    res.json(users.filter(item => item._id.toString() !== req.user.id))
}))

/*  @desc       Get user by id
 *  @route      GET /api/admin/users/:id
 *  @access     Private/Admin
 */
router.get("/users/:id", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(user){
        res.json(user)
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
}))

/*  @desc       Update user's name and isAdmin property
 *  @route      PUT /api/admin/users/:id/update
 *  @access     Private/Admin
 */
router.put("/users/:id/update", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const { name, isAdmin } = req.body; //to add more options in the future
    const user = await User.findByIdAndUpdate(req.params.id, { name, isAdmin }, { new: true, returnOriginal: false }).select("-password");
    
    if(user){
        res.json(user)
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
}))

/*  @desc       delete user by id
 *  @route      DELETE /api/admin/delete-user/:id
 *  @access     Private/Admin
 */
router.delete("/delete-user/:id", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user){
        await user.remove();
        res.json({message: "User Removed.", id: req.params.id})
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
}))


module.exports = router