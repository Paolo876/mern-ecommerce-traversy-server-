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
        const responseData = generateToken({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            // token: generateToken(user._id),
        })
        res.cookie("token", responseData, { httpOnly: true })
        // res.json("ASD")
    } else {
        res.status(401)
        throw new Error("Invalid email or password.")
    }
    res.send({email, password})
}))


/*  @desc       authorize token from cookie
 *  @route      GET /api/users/authorize
 *  @access     Public
 */
router.get("/authorize", cookieJwtAuth, async (req,res) => {
    // await User.update({isLoggedIn: true}, { where: { id:req.user.id } });
    res.json(req.user)
})


module.exports = router