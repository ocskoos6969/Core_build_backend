const { config } = require('../config/dotenvConfig')
const { findById, crEateOrder, getAllOrders } = require('../models/orderModel')
const db = require('../db/db')
const { sendOrderConfirmation } = require('../services/emailService')

// async function createOrder(req, res) {
//     try {
//         const { user_id } = req.user
//         const { product_id, quantity, fizetesi_mod } = req.body

//         console.log('Érkező adatok:', { user_id, product_id, quantity, fizetesi_mod });

//         if (!product_id || !quantity || !fizetesi_mod) {
//             return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' })
//         }

//         const user = await findById(user_id)
//         //console.log('FindById eredmény:', user);

//         if (!user) {
//             return res.status(404).json({ error: 'Felhasználó nem található!' })
//         }

//         const result = await crEateOrder(user_id, product_id, fizetesi_mod, quantity)

//         return res.status(201).json({ message: 'Sikeres rendelés létrehozás!', order_id: result.insertId })
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: 'Szerver hiba!' })
//     }
// }

const { sendOrderConfirmationEmail } = require('../services/emailService'); // példa

async function createOrder(req, res) {
    try {
        const { user_id } = req.user;
        const { product_id, quantity, fizetesi_mod } = req.body;

        if (!product_id || !quantity || !fizetesi_mod) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
        }

        // Felhasználó lekérdezése
        const userRows = await findById(user_id);
        if (!userRows || userRows.length === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található!' });
        }
        const user = userRows[0]; // az első sor tartalmazza a felhasználót

        // Rendelés létrehozása
        const result = await crEateOrder(user_id, product_id, fizetesi_mod, quantity);

        // Email küldés - itt adjuk át a user.email-t
        try {
            await sendOrderConfirmationEmail(
                user.email,
                user.username,
                {
                    order_id: result.insertId,
                    product_id: product_id,
                    quantity: quantity,
                    fizetesi_mod: fizetesi_mod
                }
            );
        } catch (emailErr) {
            console.error('Email küldési hiba:', emailErr);
            // Ne szakítsd meg a választ, csak logold
        }

        return res.status(201).json({ message: 'Sikeres rendelés létrehozás!', order_id: result.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getOrders(req, res) {
    try {
        const { user_id } = req.user

        const user = await findById(user_id)

        if (!user) {
            return res.status(404).json({ error: 'Felhasználó nem található!' })
        }

        const sql = "SELECT * FROM orders WHERE user_id = ?"
        const [orders] = await db.query(sql, [user_id])

        return res.status(200).json({ orders: orders })
    } catch (err) {
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

async function deleteOrder(req, res) {
    try {
        const { user_id } = req.user
        const { order_id } = req.params

        if (!order_id) {
            return res.status(400).json({ error: 'Rendelés ID megadása kötelező!' })
        }

        const sql = "DELETE FROM orders WHERE order_id = ? AND user_id = ?";
        const [result] = await db.query(sql, [order_id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A rendelés nem található' });
        }

        return res.status(200).json({ message: 'Sikeres rendelés törlés!' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

async function allOrders(req, res) {
    try {
        const orders = await getAllOrders()
        return res.status(200).json(orders)
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' })
    }
}

module.exports = { createOrder, getOrders, deleteOrder, allOrders }