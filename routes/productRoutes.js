const express = require('express')
const router = express.Router()
const { getProducts, getProductsById, createProducts, updateProducts, deleteProducts } = require('../controllers/productController')
const { validateProductExists } = require('../middleware/productMiddleware')
const { authenticateToken } = require('../middleware/userMiddleware')


router.get('/get', getProducts)
router.get('/:product_id', getProductsById)
router.post('/create', createProducts)
router.put('/update/:product_id', authenticateToken, updateProducts)
router.delete('/delete/:product_id', authenticateToken, deleteProducts)

module.exports = router