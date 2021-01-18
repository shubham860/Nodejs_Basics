const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(morgan('dev'));

app.use((req,res,next) => {
    req.createdAt = new Date().toISOString();
    next();
})


// ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

module.exports = app;