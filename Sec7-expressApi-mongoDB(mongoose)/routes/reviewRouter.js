const router = require('express').Router();
const { getAllReviews, addOneReview } = require('../controllers/reviewController');

router
    .route('/')
    .get(getAllReviews)
    .post(addOneReview)
