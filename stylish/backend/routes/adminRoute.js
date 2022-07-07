const express = require('express')
const multer = require('multer')
var uploadMiddleware = require('../middlewares/uploadMiddleware')
uploadMiddleware.upload = multer({
    storage: uploadMiddleware.storage,
    fileFilter: uploadMiddleware.fileFilter,
})
const router = express.Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middlewares/authMiddleware')
router.use(authMiddleware.authHandler)

router.route('/load').put(adminController.resetDemo)
router.route('/').get(adminController.getAllProducts)
router.route('/stock/:id').delete(adminController.removeStock)
router.route('/detail/:id').delete(adminController.removeDetail)
router.route('/:id').delete(adminController.removeProduct)
router.route('/stock/').post(adminController.addStock)
router
    .route('/product')
    .post([
        uploadMiddleware.upload.single('thumbnail'),
        adminController.addProduct,
    ])
router
    .route('/detail/')
    .post([uploadMiddleware.upload.single('img'), adminController.addDetail])

module.exports = router
