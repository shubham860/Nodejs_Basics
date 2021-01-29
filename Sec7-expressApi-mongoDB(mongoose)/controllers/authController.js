const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require("../models/userModels");
const CatchAsync = require("../utils/CatchAsync");
const sendEmail = require("../utils/email");
const AppError = require("../utils/AppError");
const crypto = require('crypto');


const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN} )
}


exports.signUp = CatchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        success: true,
        token,
        payload: {
           newUser
        }
    });
})

exports.signIn = CatchAsync( async (req,res,next) => {
    const {email, password} = req.body;

    // Check email and password exists
    if(!email || !password){
         return next(new AppError('provide email or password', 400));
    }

    // check password matched or not by finding the user
    const user = await User.findOne({email}).select("+password"); // IN user now password is also come which was not coming due to in userModels we did password : { select: false}
    const passwordMatched = await user.correctPassword(password, user.password); // Instance methode in userModels -- correctPassword

    if(!user || !passwordMatched){
        return next(new AppError('Invalid email or password', 401));
    }

    // Create and send token
    const token = signToken(user._id);

    res.status(200).json({
        success: true,
        token
    })
 })


// protected middleware
 exports.protect = CatchAsync( async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
     return new AppError('You are not logged in! Please log in to get access.', 401); //{ id: '60106cbaf1641d6195b9bcbe', iat: 1611691586, exp: 1620331586 }
    }

    // 2) verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    // 3) check user stills exists
     const currentUser = await User.findById(decoded.id);

     if(!currentUser){
         return next(new AppError('user is no longer exist, please login again',401))
     }

     // 4) User change password after the token was issued
     if(currentUser.changePasswordAfter(decoded.iat)){
         return next(new AppError('user changed password, please login again',401))
     }

     // Grant access to protected route
     req.user = currentUser;
       next()
 })

// for user roles and permissions - permission middleware | double arrow func means functions returning a function in this case restrictTo returning middleware
exports.restrictTo = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return next(new AppError('you do not have permission to perform this action', 403)) // 403 for forbidden
    }
    next();
}

// forgot password controller
exports.forgotPassword = CatchAsync(async (req, res, next) => {
    // get user via email
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new AppError('User does not exist', 404));
    }

    // generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send email

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
    const message = `Click here ${resetUrl} to reset the password`;

    try{
        await sendEmail({
           email: user.email,
           message,
           subject: 'Natours reset password (valid for 10 min only)'
        })

        res.status(200).json({
            success: true,
            message: 'Token send succesfully'
        })
    }catch (e){
        user.createPasswordResetToken = undefined;
        user.passwordTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
})

exports.resetPassword = CatchAsync(async (req, res, next) => {
    // 1) get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({passwordResetToken : hashedToken, passwordTokenExpiresIn: {$gt: Date.now()}});

    // 2) if token is not expired then set the password
    if(!user){
        return next(new AppError('Token is invalid or expired',404));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordTokenExpiresIn = undefined;
    await user.save()

    // 3) update the property changedPasswordAt in userModel.js using document middleware
    // 4) create token and send to the user
    const token = signToken(user._id);

    res.status(200).json({
        success: true,
        token
    })
})

exports.updatePassword = CatchAsync(async (req, res, next) => {
    const {password} = req.body;

   // 1) Get user from collection
   const user = await User.findById(req.params.id).select("+password");
   const passwordMatched = await user.correctPassword(password, user.password);

    // 2) Check if 0POSTed current password is correct
    if(!user || !passwordMatched){
        return next(new AppError('Invalid password', 401));
    }

    // 3) If so, update password
    user.password = password;
    user.passwordConfirm = password;
    await user.save();

    // 4) Log user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
        success: true,
        token
    })
});