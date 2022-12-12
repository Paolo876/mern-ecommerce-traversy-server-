const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const UserCart = require("../models/userCart");

require("dotenv").config();

/*
-a separate route for amount computations, etc...(frontend will not do any computations)
-only orderItems, shippingAddress, and paymentMethod will be in req.body

*/


/*  @desc       calculate order cost
 *  @route      POST /api/order-actions/cost-summary
 *  @access     Private
 */
router.post("/cost-summary", cookieJwtAuth, asyncHandler( async (req,res) => {
    const { address } = req.body;
    const { cartItems } = await UserCart.findOne({ user: req.user.id }).populate({path: "cartItems._id", select: "price"})
    
    const updatedCartItems = cartItems.map(item => ({quantity:item.quantity, price: item._id.price}))

    //calculate total items cost
    const itemsTotalAmount = (updatedCartItems.reduce(( acc, item) => parseFloat(acc) + parseInt(item.quantity) * parseFloat(item.price), 0).toFixed(2)) || 0
    //calculate shipping cost (to be implemented <-- address is in req.body)
    const shippingAmount = 0
    //calculate tax cost (mock)
    const taxAmount = itemsTotalAmount * .065
    const totalAmount = parseFloat(itemsTotalAmount) + parseFloat(shippingAmount) + parseFloat(taxAmount);


    res.json({itemsTotalAmount, shippingAmount, taxAmount, totalAmount})


}))

module.exports = router