const Tour = require('../models/tourModels');
const APIFeatures = require("../utils/ApiFeatures");

// Middleware for top 5 cheap tours
exports.aliasTopTour = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    next();
}


// get All tours refactored
exports.getAllTours = async (req,res) => {
    try{
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // EXECUTE QUERY
        const tours = await features.query; // we can awit query for documents

        //Send response
        res.status(200).json({
            success : true,
            payload: {
                results: tours,
                totalCount: tours.length
            }
        })
    }catch (e){
        res.status(400).json({
            success: false,
            message: e
        })
    }
}


// get one tour
exports.getOneTour = async (req,res) => {
   try{
       const tour = await Tour.findById(req.params.id)
       // const tour  = await Tour.findOne({_id: req.params.id});
       res.status(200).json({
           success : true,
           payload: tour,
       })
   }catch (e){
       res.status(400).json({
           success: false,
           message: e
       })
   }
}


// add one tour
exports.addOneTour = async (req,res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            success: true,
            payload: newTour
        })
    }catch (e){
        res.status(400).json({
            success: false,
            message: e
        })
    }
}

// update one tour
exports.updateOneTour = async (req,res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            success: true,
            payload: {
                tour
            }
        })
    }catch (e){
        res.status(400).json({
            success: false,
            message: e
        })
    }

}


// delete one Tour
exports.deleteOneTour = async (req,res) => {
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            payload: {
                tour
            }
        })
    }catch (e){
        res.status(400).json({
            success: false,
            message: 'Invalid request'
        })
    }
}

// get Tour stats using aggregation pipeline ( $match, $group, $sort )

exports.getTourStats = async (req, res) => {
    try{
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
    }catch (e){
        res.status(400).json({
            success: false,
            message: e
        })
    }
}

// get monthly stats in a month we need { num Of Tours, names array , month num } of one year

exports.getMonthlyStats = async (req, res) => {
    try{
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
    }catch (e){
        res.status(400).json({
            success: false,
            message: e
        })
    }
}


