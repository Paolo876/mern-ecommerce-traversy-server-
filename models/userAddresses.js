const mongoose = require("mongoose");

module.exports = mongoose.model('UserAddresses', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        addresses: [{
            name: { type: Object, required: true},
            Address2: { type: String, required: true},
            Address1: { type: String, required: false},
            City: { type: String, required: true},
            State: { type: String, required: true},
            Zip5: { type: String, required: true},
            Zip4: { type: String, required: true},
        }],
    }, {
        timestamps: true
    }
));
