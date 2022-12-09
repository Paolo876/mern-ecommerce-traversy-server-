const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const generateToken = require("../utils/generateToken");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { OAuth2Client, getDecodedOAuthJwtGoogle } = require('google-auth-library');

require("dotenv").config();

const oAuth2Client = new OAuth2Client(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'postmessage',
  );

/*  @desc       Auth user & get token
 *  @route      POST /api/google-auth/login
 *  @access     Public
 */
router.post("/login", asyncHandler(async (req,res) => {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    try {
        const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)
        const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.OAUTH_CLIENT_ID })
        const payload = await ticket.getPayload()
        const user = await User.findOne({ email: payload.email.toLowerCase() })
        if(user){
          res.cookie("token", generateToken(user._id), { secure: true, sameSite: "none", path:"/", domain: process.env.NODE_ENV === "local" ? "localhost": ".paolobugarin.com", httpOnly: true }) //send the user id on token
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.picture,
            googleId: user.googleId,
          })

        } else {
          res.json({noUser: true, userData: { email: payload.email.toLowerCase(), googleId: payload.sub, picture: payload.picture, name: payload.name }})
        }
        
        // res.json(tokens)
      } catch (error) {
        return { status: 500, data: error }
      } 
}))


module.exports = router