const db = require('../db/db')

async function findById(user_id) {
    const sql = 'SELECT * FROM users WHERE user_id = ?'
    const [rows] = await db.query(sql, [user_id])
    return rows
}

async function crEateOrder( user_id, product_id, paymentMethod, quantity) {
    const sql = 'INSERT INTO orders (order_id, user_id, product_id, fizetesi_mod, quantity ) VALUES (NULL, ?, ?, ?, ?)'
    const [result] = await db.query(sql, [ user_id, product_id, paymentMethod, quantity ])

    return { insertId: result.insertId }
}

module.exports = { findById, crEateOrder}