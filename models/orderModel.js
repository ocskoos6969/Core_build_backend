const db = require('../db/db')

async function findById(user_id) {
    const sql = 'SELECT * FROM users WHERE user_id = ?'
    const [result] = await db.query(sql, [user_id])

    return result[0] || null
}

async function createOrder(product_id, quantity, paymentMethod, price) {
    const sql = 'INSERT INTO orders (order_id, user_id, product_id, quantity, paymentMethod, price) VALUES (NULL, NULL, ?, ?, ?, ?)'
    const [result] = await db.query(sql, [ product_id, quantity, paymentMethod, price])

    return { insertId: result.insertId }

}

module.exports = { findById, createOrder}