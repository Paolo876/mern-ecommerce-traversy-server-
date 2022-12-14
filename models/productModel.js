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
        product_name: {
            type: String,
            required: true,
        },
        image: {
            url: { type: String, required: true},
            id: { type: String, required: true},
            name: { type: String, required: true},
            thumbnail: { type: String, required: true},
        },
        bannerImage: {
            url: { type: String },
            id: { type: String },
            name: { type: String },
            thumbnail: { type: String },
        }, 
        additionalImages: [{
            url: { type: String },
            id: { type: String },
            name: { type: String },
            thumbnail: { type: String },
        }],
        hasOptions: { type: Boolean, required: true, default: false },
        productOptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductOption', required: false }],
        brand: {
            type: String,
            required: true,
        },
        features: [], 
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [ reviewSchema ],
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
            required: false,
            default: 0
        },
        //for shipping
        weight: {
            pounds: {
                type: Number,
                default: 0
            },
            ounces: {
                type: Number,
                default: 0
            },
        },
        dimensions: {
            length: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
            unit: { type: String, default: "in"}
        },
        isHazardous: {
            type: Boolean,
            required: true,
            default: false
        }
    }, {
        timestamps: true
    }
));