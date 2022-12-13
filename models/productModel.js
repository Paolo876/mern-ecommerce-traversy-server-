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
        hasSubCategory: { type: Boolean, required: true, default: false },
        subCategory:[{
            type: { type: String, required: false},
            description: { type: String, required: false},
            options: [{
                value: { type: String, required: false},
                countInStock: { type: String, required: false},
                description: { type: String, required: false},
                price: { type: Number, required: false },
                image: {
                    url: { type: String, required: false},
                    id: { type: String, required: false},
                    name: { type: String, required: false},
                    thumbnail: { type: String, required: false},
                }    
            }]
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
            required: false,
            default: 0
        },
    }, {
        timestamps: true
    }
));