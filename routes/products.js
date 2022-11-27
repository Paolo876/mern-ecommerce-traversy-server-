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
    const products = await Product.find({}).populate("reviews.user", "id name email")
    res.send(products)
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
