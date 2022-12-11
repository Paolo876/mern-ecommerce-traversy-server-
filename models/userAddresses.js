const mongoose = require("mongoose");

module.exports = mongoose.model('UserAddresses', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        addresses: [{
            name: { type: String, required: true},
            address: { type: String, required: true},
            city: { type: String, required: true},
            postalCode: { type: String, required: true},
            country: { type: String, required: true},
        }],
    }, {
        timestamps: true
    }
));
