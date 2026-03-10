const express = require('express')
const { createOrder, getOrders, deleteOrder, allOrders } = require('../controllers/orderController')
const { authenticateToken } = require('../middleware/userMiddleware')


const router = express.Router()

router.post('/create', authenticateToken ,createOrder)
router.get('/get/:order_id', authenticateToken, getOrders)
router.delete('/:order_id', authenticateToken, deleteOrder)
router.get('/all', allOrders)

module.exports = router