const express = require("express");
const asyncHandler = require("express-async-handler");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const router = express.Router();
const User = require("../models/userModel");


/*  @desc       Get all users
 *  @route      POST /api/admin/get-users
 *  @access     Private/Admin
 */
router.post("/get-users", cookieJwtAuth, asyncHandler(async (req,res) => {
    const user = await User.findById(req.user.id)
    if(user.isAdmin){
        const users = await User.find({});
        res.json(users)
    } else {
        res.status(401)
        throw new Error("Not Authorized.")
    }
}))


module.exports = router