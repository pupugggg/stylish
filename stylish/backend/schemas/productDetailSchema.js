const { DataTypes } = require("sequelize");
const defineProductDetail = (sequelize) => {
  const productDetail = sequelize.define("productDetail", {
    text: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    img: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    order:{
      allowNull:false,
      type:DataTypes.INTEGER,
    }
  },{timestamp:false});
  sequelize.productDetail = productDetail;
};
module.exports = { defineProductDetail };