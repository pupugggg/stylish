const express =require('express')
const router = express.Router()
const productController = require('../controllers/productController')
router.route('/:catagory(men|women|accessories|all)').get(productController.getProducts)
router.route('/search').get(productController.searchProducts)
router.route('/detail/:id').get(productController.getDetail)
router.use('/admin',require('./adminRoute'))
module.exports = router