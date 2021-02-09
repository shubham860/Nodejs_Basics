const User = require('../models/userModels');
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const factory = require("./factoryFunction");

const filterObj = (obj, ...fields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(fields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

// getAllUser
exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = CatchAsync(async (req, res, next) => {
//    const users = await User.find();
//    res.status(200).json({
//         success: true,
//         payload: {
//             users
//         }
//    })
// })

// get All users ends


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

exports.deleteMe = CatchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        success: true,
        data: null
    });
})


// get me starts
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}
// get me ends

// getOneUser starts
exports.getOneUser = factory.getOne(User);
// exports.getOneUser = (req,res) => {
//     res.status(500).json({success: false, message: "user is not defined yet"});
// }
// getOneUser ends

// updateOneUser
exports.updateOneUser = (req,res) => {
    res.status(500).json({success: false, message: "user is not defined yet"});
}
// addOneUser
exports.addOneUser = (req,res) => {
    res.status(500).json({success: false, message: "user is not defined yet"});
}
// deleteOneUser start
exports.deleteOneUser = factory.deleteOne(User);

// exports.deleteOneUser = (req,res) => {
//     res.status(500).json({success: false, message: "user is not defined yet"});
// }
// deleteOneUser end