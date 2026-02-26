const { findById, findAll, createProduct, updateProduct, deleteProduct } = require('../models/productModel')
const db = require('../db/db')

async function getProducts(req, res) {
    try {
        const products = await findAll()
        return res.status(200).json({ products })
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

async function getProductsById(req, res) {
    try {
        const products = await findById(req.params.product_id)
        return res.status(200).json({ products })
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

async function createProducts(req, res) {
    try {
        const { name, price } = req.body
        //const result = await createProduct(name, price)
        if (!name || !price) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' })
        }

        const productData = {
            name: name,
            price: Number(price) //számmá alakítás
        }

        const result = await createProduct(productData)

        return res.status(201).json({ message: 'Sikeres termék létrehozás!', result })
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

async function updateProducts(req, res) {
    try {
        const product_id = req.params.product_id
        const { name, price } = req.body

        if (!name || !price) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' })
        }

        const productData = { name, price }
        const updated = await updateProduct(product_id, productData)

        if (!updated) {
            return res.status(404).json({ error: 'Termék nem található!' })
        }

        return res.status(200).json({ message: 'Sikeres termék frissítés!' })
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

async function deleteProducts(req, res) {
    try {
        const product_id = req.params.product_id

        const [orders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE product_id = ?', [product_id])

        if (orders[0].count > 0) {
            return res.status(400).json({ 
                error: 'A termék nem törölhető, mert van hozzá kapcsolódó rendelés!',
                ordersCount: orders[0].count
            })
        }

        const deleted = await deleteProduct(product_id)

        if (!deleted) {
            return res.status(404).json({ error: 'Termék nem található!' })
        }

        return res.status(200).json({ message: 'Sikeres termék törlés!' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

module.exports = { getProducts, getProductsById, createProducts, updateProducts, deleteProducts }