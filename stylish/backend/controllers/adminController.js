const asyncHandler = require('express-async-handler')
const db = require('../config/db')
const path = require('path')
const fs = require('fs')
const { getProductAndJoin } = require('../models/productModel')
const { client, readThrough } = require('../config/cache')
const removeFile = (targetPath) => {
    if (!targetPath || targetPath === []) return
    if (targetPath.startsWith('uploads/demo')||targetPath.startsWith('uploads\\demo')) return
    fs.unlinkSync(path.join(__dirname, '..', targetPath))
}
const factory = (metadata, stocks, details) => {
    let data = {}
    data.metadata = metadata
    data.stocks = stocks
    data.detail = details
    data.create = async () => {
        const r = await db.sequelize.product.create({
            title: metadata.title,
            catagory: metadata.catagory,
            thumbnail: metadata.thumbnail,
            component:
                'stylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylish',
        })
        for (s of stocks) {
            const r_stock = await db.sequelize.stock.create({
                colorCode: s.colorCode,
                colorName: s.colorName,
                size: s.size,
                remain: s.remain,
                price: s.price,
                productId: r.id,
            })
        }
        for (let i = 0; i < details.length; i++) {
            const r_detail = await db.sequelize.productDetail.create({
                text: 'stylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylishstylish',
                img: details[i].img,
                order: i,
                productId: r.id,
            })
        }
    }
    return data
}
const resetDemo = asyncHandler(async (req, res) => {
    const catagoryMap = new Map()
    catagoryMap.set('a', 'accessories')
    catagoryMap.set('f', 'women')
    catagoryMap.set('m', 'men')
    await client.flushAll()
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    await db.sequelize.stock.sync({ force: true })
    await db.sequelize.productDetail.sync({ force: true })
    await db.sequelize.product.sync({ force: true })
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    const directoryPath = path.join(__dirname, '..', 'uploads')
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err)
        }
        //listing all files using forEach
        files.forEach(async (file) => {
            if (!file.startsWith('demo')) {
                removeFile(path.join('uploads', file))
            } else {
                const demo = factory(
                    {
                        title: file,
                        catagory: catagoryMap.get(file[5]),
                        thumbnail: path.join('uploads', file, 'main.jpg'),
                    },
                    [
                        {
                            colorCode: '00FFFF',
                            colorName: 'cyan',
                            size: 'm',
                            remain: 10,
                            price: 150,
                        },
                        {
                            colorCode: '00FFFF',
                            colorName: 'cyan',
                            size: 'l',
                            remain: 10,
                            price: 150,
                        },
                        {
                            colorCode: 'FFA500',
                            colorName: 'orange',
                            size: 'l',
                            remain: 10,
                            price: 150,
                        },
                        {
                            colorCode: '808080',
                            colorName: 'gray',
                            size: 'xl',
                            remain: 10,
                            price: 150,
                        },
                    ],
                    [
                        { img: path.join('uploads', file, '0.jpg') },
                        { img: path.join('uploads', file, '1.jpg') },
                    ]
                )
                await demo.create()
            }
        })
    })
    getAllProducts(req, res)
})
const addStock = asyncHandler(async (req, res) => {
    const data = req.body
    if (
        !(
            data &&
            data.colorCode &&
            data.colorName &&
            data.size &&
            data.remain &&
            data.price &&
            data.productId
        )
    ) {
        res.status(400)
        throw new Error('incomplete data, please write all fields')
    }
    let result = await db.sequelize.stock.findOne({
        where: {
            colorCode: data.colorCode,
            colorName: data.colorName,
            size: data.size,
            productId: data.productId,
        },
    })
    if (!result) {
        result = await db.sequelize.stock.create({
            colorCode: data.colorCode,
            colorName: data.colorName,
            size: data.size,
            remain: data.remain,
            price: data.price,
            productId: data.productId,
        })
    } else {
        result.update({
            colorCode: data.colorCode,
            colorName: data.colorName,
            size: data.size,
            remain: data.remain,
            price: data.price,
            productId: data.productId,
        })
        result = await result.save()
    }
    req.params.id = data.productId
    const r = await readThrough(req.params.id, getProductAndJoin, [
        req.params.id,
    ])
    res.status(200).json(r)
})

const removeStock = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400)
        throw new Error('Please add the product id you want to remove.')
    }
    const { productId } = await db.sequelize.stock.findOne({
        where: { id: id },
    })
    const result = await db.sequelize.stock.destroy({ where: { id: id } })
    if (!result) {
        res.status(400)
        throw new Error('stock not found')
    }
    req.params.id = productId
    const r = await readThrough(req.params.id, getProductAndJoin, [
        req.params.id,
    ])
    res.status(200).json(r)
})

const addProduct = asyncHandler(async (req, res) => {
    await client.flushAll()
    const data = req.body
    if (!(data && data.title && data.catagory)) {
        res.status(400)
        throw new Error('incomplete data, please write all fields')
    }
    const result = await db.sequelize.product.create({
        ...data,
        thumbnail: path.join(req.file.destination, req.file.filename),
    })
    getAllProducts(req, res)
})
const addDetail = asyncHandler(async (req, res) => {
    const data = req.body
    if (!(data && data.order && data.text)) {
        res.status(400)
        throw new Error('incomplete data, please write all fields')
    }
    let result = await db.sequelize.productDetail.findOne({
        where: {
            productId: data.productId,
            order: data.order,
        },
    })
    if (!result) {
        result = await db.sequelize.productDetail.create({
            ...data,
            img: req.file
                ? path.join(req.file.destination, req.file.filename)
                : null,
        })
    } else {
        removeFile(result.img)
        result.update({
            ...data,
            img: req.file
                ? path.join(req.file.destination, req.file.filename)
                : null,
        })
        result = await result.save()
    }
    req.params.id = data.productId
    const r = await readThrough(req.params.id, getProductAndJoin, [
        req.params.id,
    ])
    res.status(200).json(r)
})

const removeDetail = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400)
        throw new Error('Please add the product id you want to remove.')
    }
    const productDetails = await db.sequelize.productDetail.findAll({
        where: { id: id },
    })

    const { productId } = productDetails[0]
    for (let i = 0; i < productDetails.length; i++) {
        let { img } = productDetails[i]
        removeFile(img)
    }
    const result = await db.sequelize.productDetail.destroy({
        where: { id: id },
    })
    if (!result) {
        res.status(400)
        throw new Error('Detail not found')
    }
    req.params.id = productId
    const r = await readThrough(req.params.id, getProductAndJoin, [
        req.params.id,
    ])
    res.status(200).json(r)
})

const removeProduct = asyncHandler(async (req, res) => {
    console.log('enter')
    await client.flushAll()
    const id = req.params.id
    if (!id) {
        res.status(400)
        throw new Error('Please add the product id you want to remove.')
    }
    const removeTargetDetails = await db.sequelize.productDetail.findAll({
        where: { productId: id },
    })
    for (let i = 0; i < removeTargetDetails.length; i++) {
        let { img } = removeTargetDetails[i]
        removeFile(img)
    }
    await db.sequelize.productDetail.destroy({
        where: { productId: id },
    })

    await db.sequelize.stock.destroy({
        where: { productId: id },
    })
    const { thumbnail } = await db.sequelize.product.findOne({
        where: { id: id },
    })
    removeFile(thumbnail)
    await db.sequelize.product.destroy({
        where: { id: id },
    })
    getAllProducts(req, res)
})

const getAllProducts = asyncHandler(async (req, res) => {
    const rows = await db.sequelize.product.findAll({
        include: [
            {
                model: db.sequelize.productDetail,
                required: false,
            },
            {
                model: db.sequelize.stock,
                required: false,
            },
        ],
    })
    res.status(200).json({
        products: rows,
    })
})

module.exports = {
    getAllProducts,
    resetDemo,
    removeStock,
    addStock,
    removeDetail,
    addDetail,
    addProduct,
    removeProduct,
}
