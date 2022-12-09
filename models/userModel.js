const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema =  mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,  
            required: false,
        },
        picture: {
            type: String,  
            required: false,
        },
        phone: {
            type: String,  
            required: false,
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
    }, {
        timestamps: true
    }
);

// custom method for encrypting password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//encrypt password on db
userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) {// <-mongoose provided method
        next()
    }     
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)
module.exports = User
