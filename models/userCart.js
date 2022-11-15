const mongoose = require("mongoose");

module.exports = mongoose.model('UserCart', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        cartItems: [{
            quantity: {type: Number, required: true},
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        }],
    }, {
        timestamps: true
    }
));
