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
    
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.OAUTH_CLIENT_ID,
        })
        console.log(ticket)
        return ticket
      } catch (error) {
        return { status: 500, data: error }
      } 

    // console.log(tokens)
    // const userData = getDecodedOAuthJwtGoogle
    // const tokenInfo = await oAuth2Client.getTokenInfo(
    //     tokens.access_token
    //   );
    //   const auth = new GoogleAuth({
    //     scopes: 'https://www.googleapis.com/auth/userinfo.profile'
    //   });
    // console.log(tokenInfo);
    // const { email, password } = req.body;
    // const user = await User.findOne({ email: email.toLowerCase() })
    // //use custom created method matchPassword to check password validity
    // if(user && (await user.matchPassword(password))) {
    //     const responseData = {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         isAdmin: user.isAdmin }
    //     const token = generateToken(responseData._id)
    //     res.cookie("token", token, { secure: true, sameSite: "none", path:"/", domain: ".paolobugarin.com", httpOnly: true }) //send the user id on token
    //     // res.cookie("token", token, { secure: true, sameSite: "none", path:"/", domain:"vercel.app", httpOnly: true }) //send the user id on token
    //     // res.cookie("token", token, { secure: true, sameSite: "none"}) //send the user id on token
    //     res.send({...responseData, token})
    // } else {
    //     res.status(401)
    //     throw new Error("Invalid email or password.")
    // }
}))


module.exports = router