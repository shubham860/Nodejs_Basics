const Tour = require('../models/tourModels');
const ApiFeatures = require('./../utils/ApiFeatures');

// Middleware for top 5 cheap tours
exports.aliasTopTour = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    next();
}


// get All tours refactored
exports.getAllTours = async (req,res) => {
    try{
        const features = new ApiFeatures(Tour.find(), req.query)
            .filtering()
            .sorting()
            .limitingFields()
            .pagination()

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
            message: 'Invalid request'
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
            message: 'Invalid request'
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
