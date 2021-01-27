const express = require('express');
const { getAllTours, addOneTour, getOneTour, updateOneTour, deleteOneTour, aliasTopTour, getTourStats, getMonthlyStats} = require('../controllers/tourControllers');
const { protect, restrictTo }  = require('../controllers/authController');
const router = express.Router();

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
    .get(protect, getAllTours)
    .post(addOneTour);

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateOneTour)
    .delete(protect, restrictTo('admin','guide'), deleteOneTour);


module.exports = router;