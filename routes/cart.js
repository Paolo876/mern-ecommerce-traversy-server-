const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Cart = require("../models/userCart");
/*
 *  @desc       Fetch user's cart items by user id
 *  @route      GET /api/cart/:id
 *  @access     Private
 */
router.get("/:id", asyncHandler(async (req,res) => {
    const cart = await Cart.find({ user: req.params.id})
    if(cart){
        res.send(cart)
    } else {
        res.send({cartItems: []})
    }
}))