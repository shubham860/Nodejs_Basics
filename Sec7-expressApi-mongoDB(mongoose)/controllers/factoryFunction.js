// delete one document
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/ApiFeatures");

exports.deleteOne = model => CatchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('No document exists with current Id', 404));
    }

    res.status(202).json({
        success: true,
        payload: {
            doc
        }
    })

})

// update one document
exports.updateOne = model => CatchAsync(async (req,res, next) => {
        const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!doc){
            return next(new AppError('No doc exists with current Id', 404));
        }

        res.status(200).json({
            success: true,
            payload: {
                doc
            }
        })
    }
)


// create one document
exports.createOne = model => CatchAsync(async (req,res, next) => {
    const doc = await model.create(req.body);
    if(! doc){
        return next(new AppError('Doc is not created', 404));
    }

    res.status(201).json({
        success: true,
        payload: doc
    })
}) 

// get one document - even use populate in case of reviwes
exports.getOne = (model, populateOptions) => CatchAsync(async (req,res,next) => {
    const query = model.findById(req.params.id);
    if(populateOptions) query.populate(populateOptions);
    const doc = await query;

    if(!doc){
        return next(new AppError('No doc exists with current Id', 404));
    }
    res.status(200).json({
        success : true,
        payload: doc,
    })
})

// get all

exports.getAll = modal => CatchAsync(async (req,res,next) => {

    // To allow for nested GET reviews on tour (hack)
    let filter = {} // filter object is in case of nested route of GET /:tourid/reviews
    if(req.params.tourId) filter = {tour: req.params.tourId};

    const features = new APIFeatures(modal.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // EXECUTE QUERY
    const doc = await features.query; // we can awit query for documents
                    // .explain() for checking reading stats for indexing
    //Send response
    res.status(200).json({
        success : true,
        payload: {
            results: doc,
            totalCount: doc.length
        }
    })
})