const jwt = require('jsonwebtoken')
const { config } = require('../config/dotenvConfig')

function authenticateToken(req, res, next) {
    const token = req.cookies?.[config.COOKIE_NAME]
    if (!token) {
        return res.status(401).json({ message: 'Nincs cookie, hozzáférés megtagadva!' })
    }

    try {
        req.user = jwt.verify(token, config.JWT_SECRET)
        next()
    } catch (err) {
        res.status(401).json({ error: 'Érvénytelen token!' })
    }
}

module.exports = {authenticateToken}