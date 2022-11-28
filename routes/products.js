const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Product = require("../models/productModel");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");

/*  @desc       Fetch all products
 *  @route      GET /api/products
 *  @access     Public
 */
router.get("/", asyncHandler(async (req,res) => {
    const pageSize = 15; // <--limit data fetched (pagination)
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword 
        ? {
            name: {
                    $regex: req.query.keyword,
                    $options: 'i'   //<-- case insensitive
                }
        } : {};
    const count = await Product.countDocuments({...keyword}) //count products quantity
    const products = await Product.find(keyword).limit(pageSize).skip(pageSize * ( page - 1)).populate("reviews.user", "id name email")
    res.json({products, page, pages: Math.ceil(count / pageSize)})
}))

/*  @desc       Fetch products by sort/filter
 *  @route      GET /api/products
 *  @access     Public
 */
router.get("/sortBy", asyncHandler(async (req,res) => {
    const pageSize = 15; // <--limit data fetched (pagination)
    const page = Number(req.query.pageNumber) || 1;
    const sortBy = req.query.sortBy;
    const keyword = req.query.keyword 
        ? {
            name: {
                    $regex: req.query.keyword,
                    $options: 'i'   //<-- case insensitive
                }
        } : {};
    const count = await Product.countDocuments({...keyword}) //count products quantity
    const products = await Product.find(keyword).limit(pageSize).sort({ [sortBy]: -1}).skip(pageSize * ( page - 1)).populate("reviews.user", "id name email")
    res.json({products, page, pages: Math.ceil(count / pageSize)})
}))

/*  @desc       Fetch product by id
 *  @route      GET /api/products/:id
 *  @access     Public
 */
router.get("/:id", asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id )
    if(product){        
        res.send(product)
    } else {
        res.status(404)
        throw new Error('Product not found.')
    }
}))


/*  @desc       Create new review
 *  @route      POST /api/products/:id/reviews
 *  @access     Private
 */
router.post("/:id/reviews", cookieJwtAuth, asyncHandler(async (req,res) => {
    const { rating, comment, name } = req.body;
    const product = await Product.findById(req.params.id).populate("reviews.user", "id name email")

    //check if user already created a review
    if(product){        
        const existingReview = product.reviews.find(item => item.user._id.toString() === req.user.id)

        if(existingReview) {
            res.status(404)
            throw new Error('Product already reviewed.')
        }

        product.reviews.push({rating, comment, name, user: req.user.id});
        product.rating = product.reviews.reduce((acc, item) => Number(item.rating) + Number(acc), 0) / product.reviews.length
        await product.save();
        res.status(201).json({ message: "Review Successfully Added!", reviews: product.reviews})
    } else {
        res.status(404)
        throw new Error('Product not found.')
    }
}))

module.exports = router;
