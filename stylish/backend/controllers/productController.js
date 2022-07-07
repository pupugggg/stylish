const asyncHandler = require('express-async-handler')
const { Op } = require('sequelize')
const db = require('../config/db')
const { client, readThrough } = require('../config/cache')
const {
    filterAndPaginateProduct,
    getProductAndJoin,
} = require('../models/productModel')
const getProducts = asyncHandler(async (req, res) => {
    const catagory = req.params.catagory
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 0
    const pageSize = 6
    const key = 'page_' + page.toString() + '_' + catagory
    const result = await readThrough(key,filterAndPaginateProduct,[page,pageSize,catagory])
    res.status(200).json(result)
})
const searchProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
    if (!keyword) {
        res.status(400)
        throw new Error('Please add a keyword.')
    }
    const result = await db.sequelize.product.findAll({
        where: { title: { [Op.like]: `%${keyword}%` } },
    })
    res.status(200).json(result)
})
const getDetail = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400)
        throw new Error('Please add the product id you want to get.')
    }
    const result = await readThrough(id,getProductAndJoin,[id])
    res.status(200).json(result)
})

module.exports = {
    getProducts,
    searchProducts,
    getDetail,
}
