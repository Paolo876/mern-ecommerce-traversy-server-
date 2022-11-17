const mongoose = require("mongoose");

module.exports = mongoose.model('Order', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        orderItems: [{
            // name: {type: String, required: true},
            // image: {type: String, required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true},
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        }],
        shippingAddress: {
            address: { type: String, required: true},
            city: { type: String, required: true},
            postalCode: { type: String, required: true},
            country: { type: String, required: true},
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxAmount: {
            type: Number,
            required: true,
            default: 0.00
        },
        shippingAmount: {
            type: Number,
            required: true,
            default: 0.00
        },
        itemsTotalAmount: {
            type: Number,
            required: true,
            default: 0.00
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.00
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },
        isPaid: {
            type: String,
            required: true,
            default: "processing"
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false
        },
        deliveredAt: {
            type: Date,
        },
    }, {
        timestamps: true
    }
));