const express = require('express');
const { getAllTours, addOneTour, getOneTour, updateOneTour, deleteOneTour, aliasTopTour, getTourStats, getMonthlyStats} = require('../controllers/tourControllers');

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
    .get(getAllTours)
    .post(addOneTour);

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateOneTour)
    .delete(deleteOneTour);


module.exports = router;