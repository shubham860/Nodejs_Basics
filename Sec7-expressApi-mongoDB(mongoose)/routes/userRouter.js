const express = require('express');
const { getAllUsers, addOneUser, getOneUser, updateOneUser, deleteOneUser} = require('../controllers/userController');
const { signUp, signIn, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-password/:id', updatePassword);


router
    .route('/')
    .get(getAllUsers)
    .post(addOneUser)

router
    .route('/:id')
    .get(getOneUser)
    .patch(updateOneUser)
    .delete(deleteOneUser)

module.exports = router;