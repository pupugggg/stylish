const cache = require('../config/cache').client
const asyncHandler = require('express-async-handler')
const QUOTA = process.env.QUOTA || 100
const WINDOW = process.env.RATE_LIMIT_WINDOW || 1


const rateLimiter = asyncHandler(async(req,res,next)=>{
    const key = req.ip;
    const indexOfCount = 1;
    const resultOfset = await cache.multi().set(key,0,{EX:WINDOW,NX:true}).incr(key).exec()
    if(resultOfset[indexOfCount] > QUOTA){
        res.status(429).json({message:`Quota of ${QUOTA} per ${WINDOW} second exceeded.`})
        return
    }
    return next()
})

module.exports = rateLimiter