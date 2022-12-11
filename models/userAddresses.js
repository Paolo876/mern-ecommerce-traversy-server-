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
            Address2: { type: String, required: true},      //main address
            Address1: { type: String, required: false},     // suite or apt number
            City: { type: String, required: true},          //city
            State: { type: String, required: true},         //state (shorthand acronym)
            Zip5: { type: String, required: true},          // 5-digit zip code
            Zip4: { type: String, required: false},          // zip code extension
        }],
    }, {
        timestamps: true
    }
));
