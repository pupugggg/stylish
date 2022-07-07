require('dotenv').config()
const db = require('./config/db.js')
const errorMiddleware = require('./middlewares/errorMiddleware')
const session = require('express-session')
const express = require('express')
const cors = require('cors')
db.configDB()
const app = express()
if (process.env.USE_REDIS === true) {
    const rateLimiter = require('./middlewares/rateLimiterMiddleware')
    app.use(rateLimiter)
}
app.use(
    session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/v1/products', require('./routes/productRoute'))
app.use('/api/v1/auth', require('./routes/authRoute'))
app.use('/api/v1/order', require('./routes/orderRoute'))
app.use('/uploads', express.static(__dirname + '/uploads'))
if (process.env.environment == 'production') {
    const root = require('path').join(__dirname, 'build')
    app.use(express.static(root))
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root })
    })
}
app.use(errorMiddleware.errorHandler)
const port = process.env.port | 5000
app.listen(port, () => {
    console.log(`server running on port:${port}`)
})
