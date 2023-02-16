const jwt = require('jsonwebtoken')
const {Token} = require('../models/models')

module.exports = async function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: 'Invalid token'})
        }
        const userToken = await Token.findOne({where: {token}})
        if (!userToken) {
            return res.status(403).json({message: 'Invalid token'})
        }
        req.user = jwt.verify(token, process.env.SECRET_KEY)
        req.user.token = token
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: 'Invalid token'})
    }
}