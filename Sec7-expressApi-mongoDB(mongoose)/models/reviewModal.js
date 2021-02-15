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

    tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'review must belong to tour']
        },

    user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'review must belong to user']
        }
},
    {
        toJSON : { virtuals : true },
        toObject : { virtuals : true }
    })
// one review by one user using compund indexing
reviewSchema.index({tour: 1, review: 1}, {unique: true});

// statics method used on models
reviewSchema.statics.calcAverageRatings = async function (tourId){
    const stats = await this.aggregate([
        {
            $match : { tour : tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1},
                avgRating: { $avg: '$rating'}
            }
        }
    ])

   if(stats.length > 0){
       await Tour.findByIdAndUpdate(tourId, {
           ratingsAverage : stats[0].avgRating,
           ratingsQuantity : stats[0].nRatings
       })
   }else{
       await Tour.findByIdAndUpdate(tourId, {
           ratingsAverage: 4.5,
           ratingsQuantity: 0
       })
}}

// Document middleware for call calcAverageRatings
reviewSchema.post('save', function (){
    // this points to current review
    this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next()
})

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

// query middleware for populating the tour and user in review
reviewSchema.pre(/^find/, function (next){
    this.populate({path: "tour user", select: "-__v -passwordChangedAt"});
    next();
})

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;