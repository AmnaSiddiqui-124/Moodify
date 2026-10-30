const blacklistModel = require('../model/blacklist.model');
const userModel = require('../model/user.model')
const jwt = require("jsonwebtoken")
const Redis = require("../config/cache")

async function authUser(req,res,next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }


    const isTokenBlackListed = await Redis.get(token)

    if(isTokenBlackListed){
        return res.status(401).json({
            message:"Invalid token."
        })
    }

    try{
        const decoded = jwt.verify(
            token,
            process.env.jwt_url,
        )
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({
            message:"Invadid token"
        })
    }

}


module.exports = {authUser}