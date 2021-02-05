const mongoose = require('mongoose');

const reviewSchema  = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is required']
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'rating is required b/w 1 and 5']
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    tour: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true,'review must belong to tour']
        }
    ],

    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true,'review must belong to user']
        }
    ]
},
    {
        toJSON : { virtuals : true },
        toObject : { virtuals : true }
    })


const Review = mongoose.model('review', reviewSchema);

module.exports = Review;