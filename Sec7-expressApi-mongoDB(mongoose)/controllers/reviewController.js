const Review = require('../models/reviewModal');
const CatchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');

exports.getAllReviews = CatchAsync(async (req, res, next) => {
    const review = await Review.find();

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

exports.addOneReview = CatchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);

    if(!review){
        next(new AppError('review is not created', 404))
    }

    res.status(201).json({
        success: true,
        payload:{
            review,
        }
    })
})