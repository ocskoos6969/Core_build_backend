const db = require('../db/db')

async function findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?'
    const [result] = await db.query(sql, [email])

    return result[0] || null
}

async function createUser(username, hash, phone, email) {
    const sql = 'INSERT INTO `users` (userid, username, password, phone_num, email, role) VALUES (NULL, ?, ?, ?, ?, "user")'
    const [result] = await db.query(sql, [username, hash, phone, email])

    return { insertId: result.insertId }
}

async function getUsers() {
    const sql = 'SELECT * FROM users'
    const [result] = await db.query(sql)

    return result
}

async function deleteUser(user_id) {
    const sql = 'DELETE FROM `users` WHERE `userid` = ?'
    const [result] = await db.query(sql, [user_id])

    return result
}



module.exports = { findByEmail, createUser, getUsers, deleteUser }