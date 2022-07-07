const { DataTypes } = require('sequelize')
const defineOrder = (sequelize) => {
    const order = sequelize.define(
        'order',
        {
            id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            amount: {
                allowNull: true,
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                },
            },
            bank_transaction_id: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            paymentStatus: {
                allowNull: true,
                type: DataTypes.INTEGER,
            },
            paymentMsg: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            paid: {
                allowNullL: false,
                type: DataTypes.BOOLEAN,
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            address: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            phone: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    is: '[0-9]+',
                },
            },reciever:{
                allowNull:false,
                type:DataTypes.STRING,
            }
        },
        { timestamps: true }
    )
    sequelize.order = order
}
module.exports = { defineOrder }
