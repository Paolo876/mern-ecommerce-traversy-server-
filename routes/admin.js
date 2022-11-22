const express = require("express");
const asyncHandler = require("express-async-handler");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();
const User = require("../models/userModel");


/*  @desc       Get all users
 *  @route      POST /api/admin/get-users
 *  @access     Private/Admin
 */
router.get("/get-users", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const users = await User.find({});
    res.json(users.filter(item => item._id.toString() !== req.user.id))
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