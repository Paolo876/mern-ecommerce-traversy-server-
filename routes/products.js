const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Product = require("../models/productModel");
const mongoose = require("mongoose")

/*
 *  @desc       Fetch all products
 *  @route      GET /api/products
 *  @access     Public
 */
router.get("/", asyncHandler(async (req,res) => {
    const products = await Product.find({})
    res.send(products)
}))

/*
 *  @desc       Fetch product by id
 *  @route      GET /api/products/:id
 *  @access     Public
 */
router.get("/:id", asyncHandler(async (req,res) => {
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //     res.status(400);
    //     throw new Error('Invalid ID.');
    //   }
      const product = await Product.findById(req.params.id)

    if(product){
        res.send(product)
    } else {
        res.status(404).json('Product not found.')
    }
}))

module.exports = router;
