const express = require('express')
const cookieparser = require('cookie-parser')
const cors = require('cors')

const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express()

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}))

app.use('/users/', userRoutes)


module.exports = app