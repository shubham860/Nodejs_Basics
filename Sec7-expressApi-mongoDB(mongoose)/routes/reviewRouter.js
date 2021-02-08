const router = require('express').Router({mergeParams: true});
// { mergeParams : true } give tourId in case of nested routes

const { getAllReviews, addOneReview, deleteOneReview, updateOneReview} = require('../controllers/reviewController');
const {restrictTo, protect} = require('../controllers/authController');

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'),  addOneReview)

router
    .route('/:id')
    .patch(protect, updateOneReview)
    .delete(protect, deleteOneReview)

module.exports = router;
