const Tour = require('../models/tourModels');
// const APIFeatures = require("../utils/ApiFeatures");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const factory = require("./factoryFunction");

// Middleware for top 5 cheap tours
exports.aliasTopTour = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    next();
}


// get All tours refactored - starts

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = CatchAsync(async (req,res,next) => {
//     const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//
//     // EXECUTE QUERY
//     const tours = await features.query; // we can awit query for documents
//     console.log('tours',tours.length)
//
//     //Send response
//     res.status(200).json({
//         success : true,
//         payload: {
//             results: tours,
//             totalCount: tours.length
//         }
//     })
// })

// get All tours refactored - ends

// get one tour - starts

exports.getOneTour = factory.getOne(Tour);

// exports.getOneTour = CatchAsync(async (req,res,next) => {
//     const tour = await Tour.findById(req.params.id)
//         // .populate({path: "guides", select: "-__v -passwordChangedAt"})
//     // const tour  = await Tour.findOne({_id: req.params.id});
//
//     if(!tour){
//         return next(new AppError('No tour exists with current Id', 404));
//     }
//     res.status(200).json({
//         success : true,
//         payload: tour,
//     })
// })

// get one tour - starts

// add one tour - starts
exports.addOneTour = factory.createOne(Tour);

// exports.addOneTour = CatchAsync(async (req,res, next) => {
//     const newTour = await Tour.create(req.body);
//     if(! newTour){
//         return next(new AppError('Tour is not created', 404));
//     }
//
//     res.status(201).json({
//         success: true,
//         payload: newTour
//     })
// })

// add one tour - ends

// update one tour - starts
exports.updateOneTour = factory.updateOne(Tour);
// exports.updateOneTour = CatchAsync(async (req,res, next) => {
//         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         })
//
//         if(!tour){
//             return next(new AppError('No tour exists with current Id', 404));
//         }
//
//         res.status(200).json({
//             success: true,
//             payload: {
//                 tour
//             }
//         })
//     }
// )

// update one tour - ends

// delete one Tour starts

exports.deleteOneTour = factory.deleteOne(Tour);

// exports.deleteOneTour = CatchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//
//     if(!tour){
//         return next(new AppError('No tour exists with current Id', 404));
//     }
//
//     res.status(200).json({
//         success: true,
//         payload: {
//             tour
//         }
//     })
//
// })

// delete End

// get Tour stats using aggregation pipeline ( $match, $group, $sort )

exports.getTourStats = CatchAsync(async (req, res, next) => {
    const tours = await Tour.aggregate([
        {
            $match : { price : {$gte : 200} } // give documents have price gte 200
        },
        {
            $group : {
                _id : { $toUpper : '$difficulty' },
                numTours : { $sum : 1},
                numRatings : { $sum : '$ratingsQuantity'},
                avgRatings : { $avg : '$ratingsAverage'},
                avgPrice : {$avg: '$price'},
                minPrice : {$min : '$price'},
                maxPrice : {$max : '$price'}
            }
        },
        {
            $sort : {avgPrice : 1} //  1 for sorting in ascending order
        }
    ])
    res.status(200).json({
        success : true,
        payload : {
            results : tours
        }
    })
})

// get monthly stats in a month we need { num Of Tours, names array , month num } of one year

exports.getMonthlyStats = CatchAsync(async (req, res, next) => {
        const year = req.params.year * 1 // Which year

        const tours = await Tour.aggregate([
            {
                $unwind : '$startDates' // startDates is an array by unwind we can can each date's document separetly
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group : {
                    _id : {$month : '$startDates'},
                    totalTours: {$sum : 1},
                    tourNames: {$push: '$name'}
                }
            },
            {
                $addFields : { month: '$_id'}
            },
            {
                $project : { _id : 0}
            },
            {
                $sort : {month : 1}
            }
        ])

        res.status(200).json({
            success : true,
            payload : {
                results : tours
            }
        })
    }

)

// Geospatial controller - get tours within a radius
// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi

exports.getToursWithin = CatchAsync(async (req, res, next) => {
    const {distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3962.2 : distance / 6378.1;

    if(!lat || !lng){
        next(new AppError('Please provide latitute and longitude in the format lat,lng.',
            400))
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        success: true,
        data: {
            tours,
            totalCount: tours.length
        }
    })
})
