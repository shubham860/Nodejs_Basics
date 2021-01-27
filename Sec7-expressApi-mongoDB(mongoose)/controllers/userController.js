const User = require('../models/userModels');
const CatchAsync = require("../utils/CatchAsync");

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