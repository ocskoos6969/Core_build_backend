const express = require('express')
const { createOrder, getOrders, deleteOrder } = require('../controllers/orderController')
const { authenticateToken } = require('../middleware/userMiddleware')


const router = express.Router()

router.post('/create', authenticateToken ,createOrder)
router.get('/get/:order_id', authenticateToken, getOrders)
router.delete('/:order_id', authenticateToken, deleteOrder)

module.exports = router