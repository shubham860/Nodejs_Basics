const Tour = require('../models/tourModels');


//get all tours
exports.getAllTours = async (req,res) => {
    try{
        // 1(A) FILTERING -  MAKING QUERY
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields']; // fields which are reserved for other work
        excludedFields.forEach(el => delete queryObj[el]);

        // 1(B) ADVANCE FILTERING - making query
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // {duration : {gte : 5}} ---> {duration : {$gte: 5}}

        let query = Tour.find(JSON.parse(queryStr)); // filter | it will return us the query obj and we can use more method on it (for soring hv to make let query instead of const query

        // 2 - SORTING
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' '); // for multiple sorting | /sort=price,duration convert -> price,duration to (price duration) for sort method
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt'); // default : always give data in ascemding order of date
        }

        // 3 - limiting fields
        if(req.query.fields){
            const field = req.query.fields.split(',').join(' '); // duration convert -> price,duration to (price duration) for select method
            query = query.select(field);
        }else{
            query = query.select('-__v'); // minus to exclude __v from  response
        }

        // 4- PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 1;
        const skip = (page - 1 ) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const tourCount = await Tour.countDocuments();
            if(skip >= tourCount) throw new Error('page is not proper');
        }

        // EXECUTE QUERY
        const tours = await query; // we can awit query for documents

        // QUERY USING MONGOOSE METHODS
        // const tours = Tour.find()
        //                 .where('duration').equals(5)
        //                 .where('difficulty').equals('easy');

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
