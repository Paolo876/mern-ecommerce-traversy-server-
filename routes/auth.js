const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/userModel");

/*  @desc       Auth user & get token
 *  @route      POST /api/users/login
 *  @access     Public
 */
router.post("/login", asyncHandler(async (req,res) => {

}))
