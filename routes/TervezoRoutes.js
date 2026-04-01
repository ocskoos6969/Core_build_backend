const express = require('express')
const router = express.Router()
const { getProcessor, getFan, getCase, getPowerSupplies, getCoolings, getStorages, getBoards, getRAM, getGraphicsCard } = require('../controllers/TervezoController')

router.get('/processors', getProcessor)
router.get('/fans', getFan)
router.get('/cases', getCase)
router.get('/tapegyseg', getPowerSupplies)
router.get('/coolings', getCoolings)
router.get('/storages', getStorages)
router.get('/boards', getBoards)
router.get('/ram', getRAM)
router.get('/graphicsCard', getGraphicsCard)

module.exports = router