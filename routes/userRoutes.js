const express = require('express')
const { register, login, whoAmI, logout, getAllUsers, deleteUseR} = require('../controllers/userController')
const { authenticateToken } = require('../middleware/userMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/whoami', authenticateToken, whoAmI)
router.post('/logout', authenticateToken, logout)
router.get('/all', getAllUsers)
router.delete('/delete/:user_id', deleteUseR)

module.exports = router