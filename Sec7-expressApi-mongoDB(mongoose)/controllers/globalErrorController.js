const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field : ${xvalue}, please use another name`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const devError = (err, res) => {
    res.status(err.statusCode).json({
        success : err.success,
        name: err.name,
        err: err,
        stack : err.stack,
        message : err.message
    })
}

const prodError = (err, res) => {
    if(err.isOperational){
        // operational error
        res.status(err.statusCode).json({
            success : err.success,
            error: err,
            stack : err.stack,
            message : err.message
        })
    }else{
        // programming error
        console.log('error --> programming',err)
        res.status(500).json({
            success : false,
            message: 'something went very wrong !'
        })
    }
}

module.exports = (err,req,res,next) => {
    err.statusCode = req.statusCode || 500;
    err.success = err.success || false;

    if(process.env.NODE_ENV === "development"){
        devError(err, res);
    }else if(process.env.NODE_ENV === "production"){
        let errors = { ...err };

        if(errors.name === 'CastError') errors = handleCastErrorDB(errors);
        // if(errors.code === 11000) errors = handleDuplicateFieldsDB(errors);
        if(errors.name === 'ValidatorError') errors = handleValidationErrorDB(errors);
        if (errors.name === 'JsonWebTokenError') errors = handleJWTError();
        if (errors.name === 'TokenExpiredError') errors = handleJWTExpiredError();
        prodError(errors, res);
    }
    next()
}