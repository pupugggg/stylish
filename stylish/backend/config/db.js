const { Sequelize, or } = require('sequelize')
const { defineProduct } = require('../schemas/productSchema')
const { defineStock } = require('../schemas/stockSchema')
const { defineProductDetail } = require('../schemas/productDetailSchema')
const { defineUser } = require('../schemas/authSchema')
const { defineOrder } = require('../schemas/orderSchema')
const { defineOrderDetail } = require('../schemas/orderDetailSchema')
const { client } = require('./cache')

const sequelize = new Sequelize(process.env.DB_URL)
const connectivityTest = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
const configSchemaAndRelationship = (sequelize) => {
    //define schema
    defineProduct(sequelize)
    defineStock(sequelize)
    defineProductDetail(sequelize)
    defineOrder(sequelize)
    defineOrderDetail(sequelize)
    defineUser(sequelize)
    //define one to many relationship between product and stock
    sequelize.product.hasMany(sequelize.stock)
    sequelize.stock.belongsTo(sequelize.product)
    //define one to many relationship between product and productDetail
    sequelize.product.hasMany(sequelize.productDetail)
    sequelize.productDetail.belongsTo(sequelize.product)
}
const configDB = async () => {
    // checkExistOrCreate('stylish')

    await connectivityTest()
    configSchemaAndRelationship(sequelize)
    sequelize.stock.afterCreate(async (data, opt) => {
        const { productId } = data
        if (!productId) return
        await client.del(productId.toString())
    })
    sequelize.stock.afterUpdate(async (data) => {
        const { productId } = data
        if (!productId) return
        await client.del(productId.toString())
    })
    sequelize.stock.afterSave(async (data) => {
        const { productId } = data
        if (!productId) return
        await client.del(productId.toString())
    })
    sequelize.stock.beforeBulkDestroy(async (data) => {
        const {
            where: { id },
        } = data
        if (!id) {
            return
        }
        const { productId } = await sequelize.stock.findOne({
            where: { id: id },
        })
        await client.del(productId.toString())
    })
    sequelize.productDetail.afterUpdate(async (data) => {
        const { productId } = data
        if (!productId) return
        await client.del(productId.toString())
    })
    sequelize.productDetail.afterSave(async (data) => {
        const { productId } = data
        if (!productId) return
        await client.del(productId.toString())
    })
    sequelize.productDetail.beforeBulkDestroy(async (data) => {
        const {
            where: { id },
        } = data
        if (!id) {
            return
        }
        const { productId } = await sequelize.productDetail.findOne({
            where: { id: id },
        })
        await client.del(productId.toString())
    })

    await sequelize.sync({})
}
module.exports = { configDB, sequelize }
