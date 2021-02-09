const express = require('express');
const { getAllUsers, addOneUser, getOneUser, updateOneUser, deleteOneUser, updateMe, deleteMe, getMe} = require('../controllers/userController');
const { signUp, signIn, forgotPassword, resetPassword, updatePassword, protect } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Since we are using protect middleware in all below request. So, we can use it

router.use(protect);

router.patch('/updateMypassword', updatePassword);
router.patch('/update-me', updateMe);
router.delete('/delete-user', deleteMe);

router
    .route('/me')
    .get(getMe, getOneUser);

router
    .route('/')
    .get( getAllUsers)
    .post(addOneUser);

router
    .route('/:id')
    .get(getOneUser)
    .patch(updateOneUser)
    .delete(deleteOneUser);

module.exports = router;