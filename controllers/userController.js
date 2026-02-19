const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { config } = require('../config/dotenvConfig')
const { findByEmail, createUser } = require('../models/userModel')

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
}

async function register(req, res) {
    try {
        const { username, email, phone, password } = req.body
        //console.log(username, email, phone, password);

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' })
        }

        const exist = await findByEmail(email)
        if (exist) {
            return res.status(409).json({ error: 'Ez az email cím már foglalt!' })
        }

        const hash = await bcrypt.hash(password, 15)
        const { insertId } = await createUser(username, hash, phone, email)

        return res.status(201).json({ message: 'Sikeres regisztráció!', insertId })
    } catch (err) {
        return res.status(500).json({ error: 'Szerver hiba!', err })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' })
        }

        const userSQL = await findByEmail(email)
        if (!userSQL) {
            return res.status(401).json({ error: 'Hibás email cím!' })
        }

        const validPassword = await bcrypt.compare(password, userSQL.password)
        if (!validPassword) {
            return res.status(401).json({ error: 'Hibás jelszó!' })
        }

        const token = jwt.sign(
            { user_id: userSQL.user_id, email: userSQL.email, username: userSQL.username, role: userSQL.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )
        //console.log(token);
        res.cookie(config.COOKIE_NAME, token, cookieOptions)
        return res.status(200).json({ message: 'Sikeres bejelentkezés!' })
    } catch (err) {

        return res.status(500).json({ error: 'Bejelentkezési hiba!', err })
    }
}

async function whoAmI(req, res) {
    const { user_id, email, username, role } = req.user
    try {
        return res.status(200).json({ user_id: user_id, email: email, username: username, role: role })
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'whoAmI szerver oldali hiba!', err })
    }
}

async function logout(req, res) {
    return res.clearCookie(config.COOKIE_NAME, { path: '/' }).status(200).json({ message: 'Sikeres kijelentkezés!' })
}

module.exports = { register, login, whoAmI, logout }