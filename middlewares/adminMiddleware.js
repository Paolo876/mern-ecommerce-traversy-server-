const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");

const adminMiddleware = asyncHandler(async (req,res, next) => {
    const user = await User.findById(req.user.id)
    if(user.isAdmin){
        next()
    } else {
        res.status(401)
        throw new Error("Not Authorized.")
    }
})

module.exports = adminMiddleware;
