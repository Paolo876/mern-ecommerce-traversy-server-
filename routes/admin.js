const express = require("express");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ImageKit = require('imagekit');

// USERS

/*  @desc       Get all users
 *  @route      GET /api/admin/get-users
 *  @access     Private/Admin
 */
router.get("/get-users", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const users = await User.find({}).select("-password");
    res.json(users.filter(item => item._id.toString() !== req.user.id))
}))

/*  @desc       Get user info and orders by id
 *  @route      GET /api/admin/users/:id
 *  @access     Private/Admin
 */
router.get("/users/:id", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select("-password");
    const orders = await Order.find({user: req.params.id})
    if(user){
        res.json({user, orders})
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
}))

/*  @desc       Update user's information ( currently only name & isAdmin property)
 *  @route      PUT /api/admin/users/:id/update
 *  @access     Private/Admin
 */
router.put("/users/:id/update", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const { name, isAdmin } = req.body; //to add more options in the future
    const user = await User.findByIdAndUpdate(req.params.id, { name, isAdmin }, { new: true, returnOriginal: false }).select("-password");
    
    if(user){
        res.json(user)
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
}))

/*  @desc       delete user by id
 *  @route      DELETE /api/admin/delete-user/:id
 *  @access     Private/Admin
 */
router.delete("/delete-user/:id", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user){
        await user.remove();
        res.json({message: "User Removed.", id: req.params.id})
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
}))


// PRODUCTS

/*  @desc       DELETE product by id
 *  @route      DELETE /api/admin/products/:id
 *  @access     Private/Admin
 */
router.delete("/products/:id", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if(product){        
        await product.remove();
        res.json({ message: "Product Removed.", id: req.params.id })
    } else {
        res.status(404)
        throw new Error('Product not found.')
    }
}))

/*  @desc       CREATE product
 *  @route      POST /api/admin/products
 *  @access     Private/Admin
 */
router.post("/products", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const { name, price, image, brand, category, countInStock, numReviews, description } = req.body;
    console.log(req.body);

    try{
        const imagekit = new ImageKit({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY
        });
        const imageData = await imagekit.upload({
            file : image, //required
            fileName : `${name}_primary`,   //required
            folder: "/mern-traversy/products"
        })
        console.log(imageData);
        const product = await Product.create({
            name,
            price,
            image: { url: imageData.url, id: imageData.fileId, name: imageData.name, thumbnail: imageData.thumbnailUrl },
            user: req.user.id,
            brand,
            category,
            countInStock,
            numReviews,
            description,
        })
        res.status(201).send(product)
    } catch(err){
        res.status(404)
        throw new Error("Failed to create product") 
    }
}))

/*  @desc       UPDATE product
 *  @route      PUT /api/admin/products/:id
 *  @access     Private/Admin
 */
router.put("/products/:id", cookieJwtAuth, adminMiddleware, asyncHandler(async (req,res) => {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, returnOriginal: false });;
    if(product){
        res.status(201).json({ message: "Product Updated.", product})
    } else {
        res.status(404)
        throw new Error('Product not found.') 
    }
}))

module.exports = router