const {Router} = require('express')
const router = Router()
const controller = require('./authController')
const {check, oneOf} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')


router.post('/signin', [
    check('userId').normalizeEmail()
], controller.postToken)

router.post('/signup', oneOf([
    check('userId', 'email error').normalizeEmail().isEmail(),
    check('userId', 'phone error').isMobilePhone('any')
]), [
    check('password', 'pass').isLength({min: 6, max: 20})
    ],
    controller.createUser)

router.get('/info', authMiddleware, controller.getInfo)

router.get('/logout/:param', authMiddleware, controller.deleteToken)

module.exports = router