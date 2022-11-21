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
    res.json(users)
}))


module.exports = router