const router = require('express').Router();
const { getAllReviews, addOneReview } = require('../controllers/reviewController');
const {restrictTo, protect} = require('../controllers/authController');

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'),  addOneReview)

module.exports = router;
