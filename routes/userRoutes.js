const express = require('express')
const { register, login, whoAmI, logout} = require('../controllers/userController')
const { authenticateToken } = require('../middleware/userMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/whoami', authenticateToken, whoAmI)
router.post('/logout', logout)

module.exports = router