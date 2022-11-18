const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const Order = require("../models/orderModel");
const UserCart = require("../models/userCart")
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
               - orderItems will only retrieve id, quantity, and price (price must be validated, check if price on db matches.)
               - a separate route for amount computations, etc...(frontend will not do any computations)
               - only orderItems, shippingAddress, and paymentMethod will be in req.body
        */
        const order = await Order.create({
            orderItems,
            user: req.user.id,
            shippingAddress,
            paymentMethod,
            itemsTotalAmount,
            shippingAmount,
            taxAmount,
            totalAmount,
            orderStatus: "processing"
        }) 
        
        await UserCart.findOneAndUpdate({user: req.user.id}, {cartItems: []}) //delete items in cart
        res.status(201).json(order)
    } else {
        res.status(400)
        throw new Error("No items found")
    }
}))


/*
 *  @desc       get order by id
 *  @route      GET /api/orders/:id
 *  @access     Private
 */
router.get("/:id", cookieJwtAuth, asyncHandler(async ( req,res ) => {
    const order = await Order.findById(req.params.id);
    if(order){
        if(order.user.toString() === req.user.id){      //only return if logged in user placed the order.
            res.json(order)
        } else {
            throw new Error("Not authorized.")
        }    
    } else {
        res.status(404)
        throw new Error("Order not found.")

    }
}))


/*
 *  @desc       update order to paid
 *  @route      GET /api/orders/:id/pay
 *  @access     Private
 */
router.get("/:id/pay", cookieJwtAuth, asyncHandler(async ( req,res ) => {
    const order = await Order.findById(req.params.id);

    if(order){
        if(order.user.toString() === req.user.id){      //only return if logged in user placed the order.
            order.isPaid = true
            order.paidAt = Date.now()
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder)
        } else {
            throw new Error("Not authorized.")
        }    
    } else {
        res.status(404)
        throw new Error("Order not found.")

    }
}))

module.exports = router;