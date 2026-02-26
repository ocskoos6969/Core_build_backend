const productModel = require('../models/productModel')

async function validateProductExists(req, res, next) {
    try {
        const product_id = req.params.product_id || req.body.product_id || req.query.product_id

        if (!product_id) {
            return res.status(400).json({ error: 'Product ID megadása kötelező!' })
        }

        const product = await productModel.findById(product_id)

        if (!product) {
            return res.status(404).json({ error: 'Termék nem található!' })
        }

        req.product = product
        next()
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

module.exports = { validateProductExists }