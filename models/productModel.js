const db = require('../db/db')

async function findById(product_id) {
    const sql = 'SELECT * FROM products WHERE products_id = ?'
    const [result] = await db.query(sql, [product_id])
    return result[0] || null
}

async function findAll() {
    const sql = 'SELECT * FROM products'
    const [result] = await db.query(sql)
    return result
}

async function createProduct(productData) {
    const { name, price } = productData
    const sql = 'INSERT INTO products (name, price) VALUES (?, ?)'
    const [result] = await db.query(sql, [name, price])
    return { insertId: result.insertId }
}

async function updateProduct(product_id, productData) {
    const { name, price } = productData
    const sql = 'UPDATE products SET name = ?, price = ? WHERE products_id = ?'
    const [result] = await db.query(sql, [name, price, product_id])
    return result.affectedRows > 0
}

async function deleteProduct(product_id) {
    const sql = 'DELETE FROM products WHERE products_id = ?'
    const [result] = await db.query(sql, [product_id])
    return result.affectedRows > 0
}


module.exports = { findById, findAll, createProduct, updateProduct, deleteProduct }