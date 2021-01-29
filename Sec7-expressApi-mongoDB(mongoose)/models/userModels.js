const crypto = require('crypto');
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

    role: {
        type: String,
        enum: ['user', 'lead-guide', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'confirm password is required'],
        // validate only works for create and save not for update
        validate: function(el) {
            return el === this.password;
        },
        message: 'passwords are not same!'
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordTokenExpiresIn: Date
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

// Document middleware for update passwordChangedAt during reset Password
userSchema.pre('save', function (next){
    if(!this.isModified("password") || this.isNew){
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000; // - 1000 is a hack to make time equal so protect route can work properly
    next();
})

// Instance method for correct password | Instance methods are avilable with the documents
userSchema.methods.correctPassword = async function( candidatePassword,  userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check password is changed after token is issued
userSchema.methods.changePasswordAfter = function (jwtTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime(), 10);

        return jwtTimeStamp < changedTimeStamp;
    }

    // false means NOT changed
    return false
}

// Instance method for generating reset password Token
userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken =  crypto
                                .createHash('sha256')
                                .update(resetToken)
                                .digest('hex');

    this.passwordTokenExpiresIn = Date.now() + 10 * 60 * 1000;


    return resetToken;
}

const User = mongoose.model('User', userSchema);


module.exports = User;