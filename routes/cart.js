const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const UserCart = require("../models/userCart");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
/*
 *  @desc       Fetch user's cart items by user id
 *  @route      GET /api/cart/:id
 *  @access     Private
 */
router.get("/:id", cookieJwtAuth, asyncHandler(async (req,res) => {
    const cart = await UserCart.findOne({user: req.params.id})
    if(cart){
        res.send(cart)
    } else {
        res.send({cartItems: []})
    }
}))

/*
 *  @desc       Add item to user's cart
 *  @route      GET /api/cart/:id
 *  @access     Private
 */
router.post("/add/:id", cookieJwtAuth, asyncHandler(async (req,res) => {
    const cart = await UserCart.findOne({user: req.params.id})
    if(cart){
        //if cart exists, add item to cart
        res.send(cart)
    } else {
        //create cart, push item.
    }
}))

module.exports = router;