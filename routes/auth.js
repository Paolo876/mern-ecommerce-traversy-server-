const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/userModel");

/*  @desc       Auth user & get token
 *  @route      POST /api/users/login
 *  @access     Public
 */
router.post("/login", asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    //use custom created method matchPassword to check password validity
    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: null
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password.")
    }
    res.send({email, password})
}))


module.exports = router