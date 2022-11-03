const mongoose = require("mongoose");

//**not a database model */

module.exports = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    }
);