const express = require('express')
const router = express.Router()
const Jogo = require('../controllers/jogo')

router.get('/', async (req, res) => {
  try {
    const categorias = await Jogo.categorias()
    res.json(categorias)
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

module.exports = router
