const mongoose = require("mongoose");

//**not a database model */

module.exports = mongoose.model('ProductOption', mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product"},
        type: { type: String, required: true},
        description: { type: String, required: false},
        options: [{
            value: { type: String, required: true},
            countInStock: { type: String, required: true},
            description: { type: String, required: false},
            price: { type: Number, required: true },
            image: {
                url: { type: String, required: true},
                id: { type: String, required: true},
                name: { type: String, required: true},
                thumbnail: { type: String, required: true},
            }    
        }]
    }, {
        timestamps: true
    }
));