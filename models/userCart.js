const mongoose = require("mongoose");
const cartItemSchema = require("./cartItemSchema");
module.exports = mongoose.model('UserCart', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        // cartItems: [{
        //     quantity: {type: Number, required: true},
        //     _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        //     hasOption: { type: Boolean, required: true, default: false },
        //     selectedOption: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'ProductOption' }
        // }],
        cartItems: [ cartItemSchema ]
    }, {
        timestamps: true
    }
));
