const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()
router.route('/login').post(authController.login)
router.route('/register').post(authController.register)
router.route('/getMe').get([authMiddleware.authHandler,authController.getme])
module.exports = router