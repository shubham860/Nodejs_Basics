const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use((req,res,next) => {
    req.createdAt = new Date().toISOString();
    next();
})

// ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

// for unhandled routes
// if any route is not matched then this middleware will run at last to complete req/res cycle

// app.all('*',(req,res,next) => {
//     res.status(404).json({
//         success: false,
//         message: `this url ${req.originalUrl} is not on this server`
//     })
// })

// app.all('*',(req,res,next) => {
//    const err = new Error(`this url ${req.originalUrl} is not on this server`);
//    err.success = false,
//    err.statusCode = 404
//    next(err); // if we pass err in next() then it will skip all the next middleware and give errors to the global middleware
// })

app.all('*',(req,res,next) => {
    next(new AppError(`this url ${req.originalUrl} is not on this server`, 404)); // if we pass err in next() then it will skip all the next middleware and give errors to the global middleware
})


// Global middleware to handle all the errors
app.use(globalErrorController);

module.exports = app;