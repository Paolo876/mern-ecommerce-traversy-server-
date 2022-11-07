const mongoose = require("mongoose");

module.exports = mongoose.model('UserCart', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        cartItems: [{
            name: {type: String, required: true},
            image: {type: String, required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true},
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        }],
    }, {
        timestamps: true
    }
));
