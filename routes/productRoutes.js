const express = require('express')
const router = express.Router()
const { getProducts, getProductsById, createProducts, updateProducts, deleteProducts } = require('../controllers/productController')
const { validateProductExists } = require('../middleware/productMiddleware')
const { authenticateToken } = require('../middleware/userMiddleware')


router.get('/get', getProducts)
router.get('/:product_id', validateProductExists, getProductsById)
router.post('/create', createProducts)
router.put('/update/:product_id', authenticateToken, validateProductExists, updateProducts)
router.delete('/delete/:product_id', authenticateToken, validateProductExists, deleteProducts)

module.exports = router