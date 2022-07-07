const {sequelize} = require('../config/db')
const { Op } = require('sequelize')
const filterAndPaginateProduct=async(page,pageSize,catagory)=>{
    const { rows } = await sequelize.product.findAndCountAll({
        where: { catagory: {[Op.like]:catagory==='all'?'%':catagory} },
        offset: pageSize * page,
        limit: pageSize + 1,
    })
    const nextPage = rows.length === pageSize + 1 ? page + 1 : null
    if (nextPage) {
        rows.pop()
    }
    for (let i = 0; i < rows.length; i++) {
        let colors = await sequelize.stock.findAll({
            attributes: ['colorName', 'colorCode','price'],
            where: { productId: rows[i].dataValues.id, remain: { [Op.gt]: 0 } },
        })
        colors = colors.map((e) => ({
            colorName: e.colorName,
            colorCode: e.colorCode,
            price:e.price
        }))
        // remove duplicate
        colors = colors.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        t.colorCode === value.colorCode &&
                        t.colorName === value.colorName
                )
        )
        rows[i] = { ...rows[i].dataValues, colors }
   
    }
    return {
        nextPage: nextPage,
        products: rows,
    }
}

const getProductAndJoin=async(id)=>{
    const result = await sequelize.product.findAll({
        where: { id: id },
        include: [
            {
                model: sequelize.productDetail,
                required: false,
                where: { productId: id },
            },
            {
                model: sequelize.stock,
                required: false,
                where: { productId: id },
            },
        ],
    })
    if (!result || result.length === 0) {
        res.status(400)
        throw new Error('product not found')
    }
    const stocks = result[0].dataValues.stocks
    let colors = new Map(),
        sizes = new Map(),
        colorNames = new Map()
    for (let i = 0; i < stocks.length; i++) {
        colors.set(stocks[i].colorCode.toUpperCase(), 1)
        sizes.set(stocks[i].size.toUpperCase(), 1)
        colorNames.set(stocks[i].colorName.toUpperCase(), 1)
    }
    result[0].dataValues.colors = new Array(...colors.keys())
    result[0].dataValues.sizes = new Array(...sizes.keys())
    result[0].dataValues.colorNames = new Array(...colorNames.keys())
    return result
}

module.exports = {filterAndPaginateProduct,getProductAndJoin}