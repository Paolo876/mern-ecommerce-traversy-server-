const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const UserCart = require("../models/userCart");

require("dotenv").config();

/*
-a separate route for amount computations, etc...(frontend will not do any computations)
-only orderItems, shippingAddress, and paymentMethod will be in req.body

*/


//get order total       - get user's cartItems, address wil be on request body
/*  @desc       get user's saved addresses
 *  @route      GET /api/users/address
 *  @access     Private
 */
router.post("/cost-summary", cookieJwtAuth, asyncHandler( async (req,res) => {
    const { address } = req.body;
    const { cartItems } = await UserCart.findOne({ user: req.user.id }).populate({path: "cartItems", populate: { path: "product"}})
    console.log(cartItems)
    res.json(cartItems)
    // try {
    //     let user = await UserAddresses.findOne({user: req.user.id})
    //     res.status(200).json(user && user.addresses || [])
    
    // }catch(err){
    //     res.status(400)
    //     throw new Error("Failed to fetch data.")
    // }
}))

module.exports = router