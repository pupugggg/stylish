const { DataTypes } = require("sequelize");
const defineStock = (sequelize) => {
  const stock = sequelize.define("stock", {
    colorCode:{
      allowNull: false,
      type: DataTypes.CHAR(6),
      validate: {
        is:'[A-Fa-f0-9]{6}'
      }
    },
    colorName: {
      allowNull: false,
      type: DataTypes.CHAR,
      
    },
    size: {
      allowNull: false,
      type: DataTypes.CHAR,
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate:{
          min: 0
      }
  },
    remain: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
      min:0
    }
    },
  });
  sequelize.stock = stock;
};
module.exports = { defineStock };
