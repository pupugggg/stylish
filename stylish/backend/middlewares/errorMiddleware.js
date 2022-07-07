const errorHandler = (err,req,res,next) =>{
    const statusCode = res.statusCode!==200 ? res.statusCode : 400
    res.status(statusCode)
    //  only trace stack under development mode
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {errorHandler}