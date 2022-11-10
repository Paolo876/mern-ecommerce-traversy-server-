const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.model('User', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
    }, {
        timestamps: true
    }
));

// custom method for encrypting password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = userSchema
