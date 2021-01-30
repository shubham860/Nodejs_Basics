const User = require('../models/userModels');
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");

const filterObj = (obj, ...fields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(fields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

// getAllUser
exports.getAllUsers = CatchAsync(async (req, res, next) => {
   const users = await User.find();
   res.status(200).json({
        success: true,
        payload: {
            users
        }
   })
})

exports.updateMe = CatchAsync(async (req, res, next) => {
    // 1) cannot post any password fields
    if(req.body.password || req.body.passwordConfirm){
        return next (new AppError('this route is not for password fields', 400))
    }

    // 2) filter out unwanted fields which user can't update itself only admin can
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) find user and update
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true});

    // 4) send response
    res.status(200).json({
        success: true,
        payload: {
            user : updatedUser
        }
    });
})

// getOneUser
exports.getOneUser = (req,res) => {
    res.status(500).json({success: false, message: "user is not defined yet"});
}
// updateOneUser
exports.updateOneUser = (req,res) => {
    res.status(500).json({success: false, message: "user is not defined yet"});
}
// addOneUser
exports.addOneUser = (req,res) => {
    res.status(500).json({success: false, message: "user is not defined yet"});
}
// deleteOneUser
exports.deleteOneUser = (req,res) => {
    res.status(500).json({success: false, message: "user is not defined yet"});
}