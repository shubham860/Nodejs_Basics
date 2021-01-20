const express = require('express');
const { getAllTours, addOneTour, getOneTour, updateOneTour, deleteOneTour, checkId, checkTourBody } = require('../controllers/tourControllers');

const router = express.Router();

router.param('id',checkId); // param middleware to check id is valid or not

router
    .route('/')
    .get(getAllTours)
    .post(checkTourBody, addOneTour)

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateOneTour)
    .delete(deleteOneTour)


module.exports = router;