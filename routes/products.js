const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Product = require("../models/productModel");
const ProductOption = require("../models/productOptionModel");
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
    const products = await Product.find(keyword).limit(pageSize).skip(pageSize * ( page - 1)).populate("reviews.user", "id name email").populate("productOptions", "image price")
    res.json({products, page, pages: Math.ceil(count / pageSize)})
}))

/*  @desc       Fetch products by sort/filter
 *  @route      GET /api/products
 *  @access     Public
 */
router.get("/q", asyncHandler(async (req,res) => {
    const pageSize = 15; // <--limit data fetched (pagination)
    const page = Number(req.query.pageNumber) || 1;
    const sortValue = req.query.sort;
    const keyword = req.query.keyword 
        ? {
            name: {
                    $regex: req.query.keyword,
                    $options: 'i'   //<-- case insensitive
                }
        } : {};
    const count = await Product.countDocuments({...keyword}) //count products quantity
    const products = await Product.find(keyword).limit(pageSize).sort({ [sortValue]: -1}).skip(pageSize * ( page - 1)).populate("reviews.user", "id name email").populate("productOptions", "image price")
    res.json({products, page, pages: Math.ceil(count / pageSize)})
}))


/*  @desc       showcase most popular products
 *  @route      GET /api/products
 *  @access     Public
 */
router.get("/showcase", asyncHandler(async (req,res) => {
    const products = await Product.find({}).limit(5).sort({ rating: -1}).populate("productOptions", "price").select("bannerImage name price hasOptions description productOptions rating numReviews").select("bannerImage name hasOptions productOptions price rating numReviews description")
    res.json({ products })
}))


/*  @desc       Fetch product by id
 *  @route      GET /api/products/:id
 *  @access     Public
 */
router.get("/:id", asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id).populate("productOptions", "price image name countInStock")
    if(product){        
        res.send(product)
    } else {
        res.status(404)
        throw new Error('Product not found.')
    }
}))


/*  @desc       Fetch array of products by id
 *  @route      POST /api/products/:id
 *  @access     Public
 */
router.post("/product-informations", asyncHandler(async (req,res) => {
    const productIds = req.body.cartItems.map(item => item._id);
    const products = await Product.find({'_id': { $in: productIds}}).select("name image price")
    res.send(products)
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
