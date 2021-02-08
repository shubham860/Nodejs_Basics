const Review = require('../models/reviewModal');
const CatchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');
const factory = require("./factoryFunction");

exports.getAllReviews = CatchAsync(async (req, res, next) => {
    let filter = {} // filter object is in case of nested route of GET /:tourid/reviews

    if(req.params.tourId) filter = {tour: req.params.tourId};

    const review = await Review.find(filter);

    if(!review){
        next(new AppError('No review found', 404))
    }

    res.status(200).json({
        success: true,
        payload:{
            reviews: review,
            totalCount: review.length
        }
    })
})

// get one tour
exports.getOneReview = CatchAsync(async (req,res,next) => {
    const review = await Review.findById(req.params.id)
    // .populate({path: "guides", select: "-__v -passwordChangedAt"})
    // const tour  = await Tour.findOne({_id: req.params.id});

    if(!review){
        return next(new AppError('No tour exists with current Id', 404));
    }
    res.status(200).json({
        success : true,
        payload: review,
    })
})

exports.setTourIds = (req, res, next) => {
    // NESTED Routes
    if( !req.body.tour ) req.body.tour = req.params.tourId;
    if( !req.body.user ) req.body.user = req.user.id;
    next();
}


// Add review - starts
exports.addOneReview = factory.createOne(Review);

//     exports.addOneReview = CatchAsync(async (req, res, next) => {
//     // NESTED Routes
//     if( !req.body.tour ) req.body.tour = req.params.tourId;
//     if( !req.body.user ) req.body.user = req.user.id;
//
//     // console.log('req.body', req.body)
//
//     const review = await Review.create(req.body);
//
//     console.log('review',review)
//
//     if(!review){
//         next(new AppError('review is not created', 404))
//     }
//
//     res.status(201).json({
//         success: true,
//         payload:{
//             review,
//         }
//     })
// })


// Add review - ends

// update one review
exports.updateOneReview = factory.updateOne(Review);


// delete one review
exports.deleteOneReview = factory.deleteOne(Review);

