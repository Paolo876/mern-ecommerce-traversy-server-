const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const Order = require("../models/orderModel");

/*
 *  @desc       create new order
 *  @route      POST /api/orders
 *  @access     Private
 */
router.post("/", cookieJwtAuth, asyncHandler(async (req,res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsTotalAmount, shippingAmount, taxAmount, totalAmount } = req.body;

    if(orderItems && orderItems.length !== 0) {
        /*
            -future changes: 
               - orderItems will only retrieve id and quantity
               - a separate route for amount computations, etc...(frontend will not do any computations)
               - only orderItems, shippingAddress, and paymentMethod will be in req.body
        */
        const order = await Order.create({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsTotalAmount,
            shippingAmount,
            taxAmount,
            totalAmount,
            orderStatus: "processing"
        })

        res.status(201).json(order)
    } else {
        res.status(400)
        throw new Error("No items found")
    }
}))

module.exports = router;