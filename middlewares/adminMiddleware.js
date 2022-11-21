const User = require("../models/userModel")

const adminMiddleware = async (req,res, next) => {
    const user = await User.findById(req.user.id)
    if(user.isAdmin){
        next()
    } else {
        res.status(401).json("Not Authorized.")
    }
}
module.exports = adminMiddleware;
