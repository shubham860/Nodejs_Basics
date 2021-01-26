const jwt = require('jsonwebtoken');
const User = require("../models/userModels");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");



exports.signUp = CatchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN} )

    res.status(201).json({
        success: true,
        token,
        payload: {
           newUser
        }
    });
})