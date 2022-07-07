const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const db = require('../config/db')
const { hash } = require('bcrypt')
const jwt = require('jsonwebtoken')
const register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('Please fill all field in register form.')
    }
    const userExist = await db.sequelize.user.findOne({
        where: { email: email },
    })
    if (userExist) {
        res.status(400)
        throw new Error('The email have already been used.')
    }
    const saltRounds = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, saltRounds)
    const user = await db.sequelize.user.create({
        username: username,
        email: email,
        hashedPassword: hashed,
        isAdmin:true
    })
    const token =  genToken(user)
    res.status(200).json({user:user.username,token})
})
const login = asyncHandler(async (req, res, next) => {
    const {email,password} = req.body;
    if(!email || ! password){
        res.status(400)
        throw new Error('Please fill all fields.')
    }
    const user = await db.sequelize.user.findOne({where:{email:email}})
    if(!user){
        res.status(400)
        throw new Error('User not found.')
    }
    const passwordMatched = await bcrypt.compare(password,user.hashedPassword)
    if(!passwordMatched){
        res.status(400)
        throw new Error('Password mismatched')
    }
    const token = genToken(user)
    res.status(200).json({username:user.username, token })
})
const getme = asyncHandler(async (req, res, next) => {
    res.status(200).json(req.user)
})
const genToken=  (user)=>{
    const token = jwt.sign(
        {username:user.username,email:user.email,password:user.password},
         process.env.jwtPrivateKey,
         {expiresIn:'30d'}
     )
     return token
}
module.exports = { register, login, getme }
