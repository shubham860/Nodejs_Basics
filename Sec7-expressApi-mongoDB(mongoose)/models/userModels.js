const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },

    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate : [validator.isEmail, 'please provide a valid email']
    },

    photo : String,

    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8
    },

    passwordConfirm: {
        type: String,
        required: [true, 'confirm password is required'],
        validate: function(el) {
            return el === this.password;
        },
        message: 'passwords are not same!'
    }
})

// Document middleware for encrypt the password using bcrypt
userSchema.pre('save', async function(next){
    // only run when the password is actually modified
    if(!this.isModified("password")) return next();

    // Hash the password with cost of two
    this.password = await bcrypt.hash(this.password, 12);

    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);


module.exports = User;