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
router.post("/add", cookieJwtAuth, asyncHandler(async (req,res) => {
    let cart = await UserCart.findOne({user: req.user.id})
    const { cartItems } = req.body;
    if(!cart){
        console.log(cartItems);
        cart = await UserCart.create({
            user: req.user.id,
            cartItems
        })
        res.status(201).json(cart)
    } else {
        console.log(cart);
        // for(const item of cartItems){
        //     console.log(item._id)
        // }
    }

}))

module.exports = router;