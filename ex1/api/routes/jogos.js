const express = require('express')
const router = express.Router()
const Jogo = require('../controllers/jogo')

router.get('/', async (req, res) => {
  try {
    const jogos = await Jogo.list(req.query.editora)
    res.json(jogos)
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const jogo = await Jogo.findById(req.params.id)
    enviarOu404(res, jogo, 'Jogo nao encontrado')
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const jogo = await Jogo.insert(req.body)
    res.status(201).json(jogo)
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const jogo = await Jogo.update(req.params.id, req.body)
    enviarOu404(res, jogo, 'Jogo nao encontrado')
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const jogo = await Jogo.remove(req.params.id)
    enviarOu404(res, jogo, 'Jogo nao encontrado')
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

function enviarOu404(res, dados, mensagem) {
  if (!dados) return res.status(404).json({ erro: mensagem })
  return res.json(dados)
}

module.exports = router
