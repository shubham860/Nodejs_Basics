// delete one document
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");

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