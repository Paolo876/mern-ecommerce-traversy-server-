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
 *  @route      POST /api/users/login
 *  @access     Public
 */
router.post("/login", asyncHandler(async (req,res) => {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    try {
        const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)
        const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.OAUTH_CLIENT_ID })
        const payload = await ticket.getPayload()
        const user = await User.findOne({ email: payload.email.toLowerCase() }).select("name email _id isAdmin")
        if(user){
            //payload (googleId: payload.sub, picture: payload.picture)
            console.log(user)

        } else {
          res.json({noUser: true, userData: { email: payload.email.toLowerCase(), googleId: payload.sub, picture: payload.picture, name: payload.name }})
        }
        
        // res.json(tokens)
      } catch (error) {
        return { status: 500, data: error }
      } 
}))


module.exports = router