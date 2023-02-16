const {User, Token} = require('./models/models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

const generateToken = (userId, typeId) => {
    const payload = {
        id: userId,
        type: typeId
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '10m'})
}

class AuthController {
    async postToken(req, res) {
        try {
            const {userId, password} = req.body

            const user = await User.findOne({where: {userId}})
            if (!user) {
                return res.status(400).json({message: 'User is not found'})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: 'Incorrect password'})
            }

            const token = generateToken(user.userId, user.typeId)

            const userToken = await Token.findOne({where: {userId}})

            if (!userToken) {
                await Token.create({userId, token})
                return res.json({token})
            }

            userToken.token = token
            await userToken.save()
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Request error'})
        }
    }

    async createUser(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }

            const {userId, password} = req.body

            const typeId = userId.includes('@') ? 'email' : 'phone'

            const candidate = await User.findOne({where: {userId}})

            if (candidate) {
                return res.status(400).json({message: 'User already created'})
            }

            const hashPassword = await bcrypt.hash(password, 4)
            const token = generateToken(userId, typeId)

            const user = await User.create({userId, password: hashPassword, typeId})
            const userToken = await Token.create({userId, token})

            await userToken.save()
            await user.save()

            return res.status(201).json({message: 'User created', token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Creation error'})
        }
    }

    async getInfo(req, res) {
        try {
            const {id: userId, type: typeId, token} = req.user

            const userToken = await Token.findOne({where: {token}})

            userToken.token = generateToken(userId, typeId)

            await userToken.save()

            res.json({id: userId, type: typeId, token: userToken.token})
        } catch (e) {
            console.log(e)
        }
    }

    async deleteToken(req, res) {
        try {
            const param = req.params.param.toLowerCase()

            const token = req.user.token

            if (param === 'all') {
                await Token.destroy({truncate: true})
                return res.json({message: `Completed ALL`})
            }

            await Token.destroy({where: {token}})

            return res.json({message: `Completed ONE`})
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new AuthController()