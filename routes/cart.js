const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const UserCart = require("../models/userCart");
const Products = require("../models/productModel")
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const mongoose = require("mongoose");

/*
 *  @desc       Fetch user's cart items by user id
 *  @route      GET /api/cart/:id
 *  @access     Private
 */
router.get("/", cookieJwtAuth, asyncHandler(async (req,res) => {
    const cart = await UserCart.findOne({user: req.user.id})
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
        cart = await UserCart.create({
            user: req.user.id,
            cartItems
        })
        res.status(201).json(cart)
    } else {
        for (const reqItem of cartItems){
            const existingItem = cart.cartItems.find(item => item._id.toString() === reqItem._id)   //check if item is already in cart, add quantity
            const product = await Products.findById(reqItem._id); //check product if there is enough in stock
            if(existingItem){
                existingItem.quantity = parseInt(existingItem.quantity) + parseInt(reqItem.quantity)
                if(existingItem.quantity > product.countInStock) existingItem.quantity = product.countInStock
            } else{
                if(reqItem.quantity > product.countInStock) reqItem.quantity = product.countInStock
                cart.cartItems.push({...reqItem, _id: mongoose.Types.ObjectId(reqItem._id)})    //push to cart
            }
        }
        cart.save()
        res.status(201).json(cart)

    }

}))

module.exports = router;