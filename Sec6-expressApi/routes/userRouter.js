const express = require('express');
const { getAllUsers, addOneUser, getOneUser, updateOneUser, deleteOneUser} = require('../controllers/userController');

const router = express.Router();

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