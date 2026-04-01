const { getProcessors, getFans, getCases, getPowerSupply, getCooling, getStorage, getBoard, getRAMs, getGraphicsCards } = require('../models/TervezoModel');

async function getProcessor(req, res) {
    try {
        const processors = await getProcessors();
        return res.status(200).json({ processors });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getFan(req, res) {
    try {
        const fans = await getFans();
        return res.status(200).json({ fans });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getCase(req, res) {
    try {
        const cases = await getCases();
        return res.status(200).json({ cases });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getPowerSupplies(req, res) {
    try {
        const powerSupplies = await getPowerSupply();
        return res.status(200).json({ powerSupplies });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getCoolings(req, res) {
    try {
        const coolings = await getCooling();
        return res.status(200).json({ coolings });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getStorages(req, res) {
    try {
        const storages = await getStorage();
        return res.status(200).json({ storages });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getBoards(req, res) {
    try {
        const boards = await getBoard();
        return res.status(200).json({ boards });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getRAM(req, res) {
    try {
        const rams = await getRAMs();
        return res.status(200).json({ rams });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

async function getGraphicsCard(req, res) {
    try {
        const graphicsCards = await getGraphicsCards();
        return res.status(200).json({ graphicsCards });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!' });
    }
}

module.exports = { getProcessor, getFan, getCase, getPowerSupplies, getCoolings, getStorages, getBoards, getRAM, getGraphicsCard }