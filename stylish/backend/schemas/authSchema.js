const { DataTypes } = require('sequelize')
const defineUser = (sequelize) => {
    const user = sequelize.define(
        'user',
        {
            id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            hashedPassword: {
                allowNull: false,
                type: DataTypes.STRING(60),
            },
            isAdmin: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
            },
        },
        { timestamp: false }
    )
    sequelize.user = user
}
module.exports = { defineUser }
