const express = require('express');
const { getAllTours, addOneTour, getOneTour, updateOneTour, deleteOneTour } = require('../controllers/tourControllers');

const router = express.Router();

router
    .route('/')
    .get(getAllTours)
    .post(addOneTour)

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateOneTour)
    .delete(deleteOneTour)


module.exports = router;