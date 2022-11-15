const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");

/*
 *  @desc       create new order
 *  @route      POST /api/orders
 *  @access     Private
 */
router.post("/", cookieJwtAuth, asyncHandler(async (req,res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsTotalAmount, shippingAmount, taxAmount, totalAmount } = req.body;

    if(orderItems && orderItems.length !== 0) {

    } else {
        
    }
}))