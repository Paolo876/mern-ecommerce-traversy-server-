const mongoose = require("mongoose");

module.exports = mongoose.model('UserAddresses', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        addresses: [{
            name: { type: String, required: true},          //name of receipient
            address2: { type: String, required: true},      //main address
            address1: { type: String, required: false},     // suite or apt number
            city: { type: String, required: true},          //city
            state: { type: String, required: true},         //state (shorthand acronym)
            zip5: { type: String, required: true},          // 5-digit zip code
            zip4: { type: String, required: false},          // zip code extension
        }],
    }, {
        timestamps: true
    }
));
