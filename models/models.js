const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    userId: {type: DataTypes.STRING, unique: true, required: true},
    password: {type: DataTypes.STRING, required: true},
    typeId: {type: DataTypes.STRING, required: true}

})

const Token = sequelize.define('token', {
    userId: {type: DataTypes.STRING, unique: true, required: true},
    token: {type: DataTypes.STRING, required: true}
})

module.exports = {User, Token}