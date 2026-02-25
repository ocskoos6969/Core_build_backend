const {config} = require('../config/dotenvConfig')

async function createOrder(req, res) {
    try {
        const { user_id } = req.user
        const { product_id, quantity } = req.body

        if (!product_id || !quantity) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' })
        }

        // Itt jönne a logika az order létrehozásához, például adatbázis műveletek

        return res.status(201).json({ message: 'Sikeres rendelés létrehozás!' })
    } catch (err) {
        return res.status(500).json({ error: 'Szerver hiba!', err })
    }
}

async function getOrders(req, res) {
    try {
        const { user_id } = req.user

        // Itt jönne a logika a rendelések lekéréséhez, például adatbázis műveletek

        return res.status(200).json({ orders: [] }) // Példa válasz
    } catch (err) {
        return res.status(500).json({ error: 'Szerver hiba!', err })
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
        return res.status(500).json({ error: 'Szerver hiba!', err })
    }
}

module.exports = { createOrder, getOrders, deleteOrder }