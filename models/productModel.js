const mongoose = require("mongoose");
const reviewSchema = require("./reviewSchema");

module.exports = mongoose.model('Product', mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'         //ref adds the relationship between product and user
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            url: { type: String, required: true},
            id: { type: String, required: true},
            name: { type: String, required: true},
            thumbnail: { type: String, required: true},
        },
        additionalImages: [{
            url: { type: String, required: true},
            id: { type: String, required: true},
            name: { type: String, required: true},
            thumbnail: { type: String, required: true},
        }],
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0
        },
    }, {
        timestamps: true
    }
));