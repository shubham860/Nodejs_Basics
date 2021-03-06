const express = require('express');
const { getAllTours, addOneTour, getOneTour, updateOneTour, deleteOneTour, aliasTopTour, getTourStats, getMonthlyStats, getToursWithin} = require('../controllers/tourControllers');
const { protect, restrictTo }  = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

// NESTED router
router.use('/:tourId/reviews', reviewRouter);


// Geospatial queries :-
// Finding tours within radius
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin)

// Ends geospatial queries

router
    .route('/tour-monthly-stats/:year')
    .get(getMonthlyStats);

router
    .route('/top-5-cheap-tours')
    .get(aliasTopTour, getAllTours);

router
    .route('/tour-stats')
    .get(getTourStats)

router
    .route('/')
    .get(getAllTours)
    .post(protect,restrictTo('admin','guide'), addOneTour);

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateOneTour)
    .delete(protect, restrictTo('admin','guide'), deleteOneTour);


module.exports = router;