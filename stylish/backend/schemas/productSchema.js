const { DataTypes } = require('sequelize')
const defineProduct = (sequelize) => {
    const product = sequelize.define('product', {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        thumbnail: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        title: {
            allowNull: false,
            type: DataTypes.CHAR,
            unique: 'actions_unique',
        },
        catagory: {
            allowNull: false,
            type: DataTypes.CHAR,
            validate: {
                isIn: [['men', 'women', 'accessories']],
            },
            unique: 'actions_unique',
        },
        component: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
    },{
        uniqueKeys: {
            actions_unique: {
                fields: ['title', 'catagory']
            }
        }
      })
  
    sequelize.product = product
}


module.exports = { defineProduct }
