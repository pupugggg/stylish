const { DataTypes } = require('sequelize')
const defineOrderDetail = (sequelize) => {
    const orderDetail = sequelize.define('orderDetail', {
        stockId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        number: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate:{
                min:1
            }
        },
        orderId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    })
    sequelize.orderDetail = orderDetail
}
module.exports = { defineOrderDetail }