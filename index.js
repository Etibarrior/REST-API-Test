require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', require('./authRouter'))

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()