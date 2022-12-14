const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const UserCart = require("../models/userCart");
const Products = require("../models/productModel")
const ProductOption = require("../models/productOptionModel");
const cartItemSchema = require("../models/cartItemSchema");
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
 *  @desc       get cart items information
 *  @route      POST /api/cart/cart-items-information
 *  @access     Public
 */
router.post("/cart-items-information", asyncHandler(async (req,res) => {
    const { cartItems } = req.body;
    let result = []
    for(const item of cartItems) {
        let updatedProduct = item
        const product = await Products.findById(item._id).select("name image price countInStock").lean()
        updatedProduct = { ...item, ...product }
        if(item.hasOption){
            const selectedOption = await ProductOption.findById(item.selectedOption).select("name image price countInStock").lean()
            updatedProduct.selectedOption = selectedOption;
        }
        result.push(updatedProduct)
    }
    res.send(result)
}))

/*
 *  @desc       Add item to user's cart
 *  @route      GET /api/cart/:id
 *  @access     Private
 */
router.post("/add", cookieJwtAuth, asyncHandler(async (req,res) => {
    let cart = await UserCart.findOne({user: req.user.id})
    const { cartItems } = req.body;     //cartItems array type - adds the items to user's cart
    if(!cart){
        cart = await UserCart.create({
            user: req.user.id,
            cartItems
        })
        res.status(201).json(cart)
    } else {

        for (const reqItem of cartItems){
            if(reqItem.hasOption){
                const existingItem = cart.cartItems.find(item => item.hasOption && item.selectedOption.toString() === reqItem.selectedOption)   //check if item is already in cart, add quantity
                const productOption = await ProductOption.findById(reqItem.selectedOption);

                if(existingItem){
                    existingItem.quantity = parseInt(existingItem.quantity) + parseInt(reqItem.quantity)
                    if(existingItem.quantity > productOption.countInStock) existingItem.quantity = productOption.countInStock
                } else {
                    if(reqItem.quantity > productOption.countInStock) reqItem.quantity = productOption.countInStock
                    cart.cartItems.push({...reqItem, _id: mongoose.Types.ObjectId(reqItem._id), selectedOption: mongoose.Types.ObjectId(reqItem.selectedOption)})
                }

            } else {
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

        }
        cart.save()
        res.status(201).json(cart)
    }
}))


/*
 *  @desc       change quantity of cart items
 *  @route      PUT /api/cart/change-quantity
 *  @access     Private
 */
router.put("/change-quantity", cookieJwtAuth, asyncHandler(async (req,res) => {
    const cart = await UserCart.findOne({user: req.user.id})
    const reqItem = req.body.item;
    if(reqItem.hasOption){
        const cartItem = cart.cartItems.find(item => item.hasOption && item.selectedOption.toString() === reqItem.selectedOption._id)
        cartItem.quantity = reqItem.quantity;
        const productOption = await ProductOption.findById(reqItem.selectedOption);
        if(cartItem.quantity > productOption.countInStock) cartItem.quantity = productOption.countInStock
    }else {
        const cartItem = cart.cartItems.find(item => item._id.toString() === reqItem._id)
        cartItem.quantity = reqItem.quantity;
        const product = await Products.findById(reqItem._id); //check product if there is enough in stock
        if(cartItem.quantity > product.countInStock) cartItem.quantity = product.countInStock
    }
    cart.save()
    res.status(201).json(reqItem)
}))

/*
 *  @desc       remove item from cart
 *  @route      PUT /api/cart/remove
 *  @access     Private
 */
router.put("/remove-item", cookieJwtAuth, asyncHandler(async (req,res) => {
    const cart = await UserCart.findOne({user: req.user.id})
    const itemId = req.body.id
    const cartItems = cart.cartItems.filter(item => item.hasOption ? item.selectedOption.toString() !== itemId : item._id.toString() !== itemId)
    cart.cartItems = cartItems
    cart.save()
    res.status(201).json(itemId)
}))

module.exports = router;