const db = require('../db/db')

async function getProcessors() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%processzor%" AND name NOT LIKE "%hűtő%" AND name NOT LIKE "%vízhűtés%"';
    //console.log(sql);
    const [result] = await db.query(sql);
    return result;
}

async function getGraphicsCards() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%videokártya%";'
    const [result] = await db.query(sql)
    return result
}

async function getRAMs() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%RAM%";'
    const [result] = await db.query(sql)
    return result
}

async function getBoard() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%alaplap%";'
    const [result] = await db.query(sql)
    return result
}

async function getStorage() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%SSD%" OR name LIKE "%HDD%";'
    const [result] = await db.query(sql)
    return result
}

async function getCooling() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%hűtő%" OR name LIKE "%vízhűtés%";'
    const [result] = await db.query(sql)
    return result
}

async function getPowerSupply() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%tápegység%";'
    const [result] = await db.query(sql)
    return result
}

async function getCases() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%ház%";'
    const [result] = await db.query(sql)
    return result
}

async function getFans() {
    const sql = 'SELECT * FROM products WHERE name LIKE "%ventilátor%";'
    const [result] = await db.query(sql)
    return result
}

module.exports = { getFans, getCases, getPowerSupply, getCooling, getStorage, getBoard, getRAMs, getGraphicsCards, getProcessors }