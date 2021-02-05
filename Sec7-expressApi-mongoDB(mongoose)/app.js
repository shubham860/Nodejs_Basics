const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');

const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

const app = express();

// GLOBAL MIDDLEWARES

// set security for http headers
app.use(helmet());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitiztion against xss
app.use(xss());

// prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'price'] //  allow duplication in query  like /api/v1/tours/duration=5&duration=9
}))

// Body parser, ready data from body into req.body
app.use(express.json({limit: '10kb'}));

//Serving static files
app.use(express.static(`${__dirname}/public`));

// Rate limiter to prevents the attack like denial of service(DOS) and brute force
const limiter = rateLimiter({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour"
})

app.use('/api',limiter);

// logging requests
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
app.use('/api/v1/reviews',reviewRouter);

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


    