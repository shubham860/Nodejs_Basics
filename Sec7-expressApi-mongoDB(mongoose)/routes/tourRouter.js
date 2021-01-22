const express = require('express');
const { getAllTours, addOneTour, getOneTour, updateOneTour, deleteOneTour, aliasTopTour } = require('../controllers/tourControllers');

const router = express.Router();

router
    .route('/top-5-cheap-tours')
    .get(aliasTopTour, getAllTours);

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