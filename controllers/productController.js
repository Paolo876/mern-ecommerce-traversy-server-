const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");


/*
 *  @desc       Fetch all products
 *  @route      GET /api/products
 *  @access     Public
 */
const getProducts = asyncHandler( async( req, res ) => {
    const products = await Product.find({})
    res.send(products)
})