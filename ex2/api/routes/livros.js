const express = require('express')
const router = express.Router()
const Livro = require('../controllers/livro')

router.get('/', async (req, res) => {
  try {
    const livros = await Livro.list(req.query.search)
    res.json(livros)
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const livro = await Livro.insert(req.body)
    res.status(201).json(livro)
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const livro = await Livro.updateEstado(req.params.id, req.body.lido)
    enviarOu404(res, livro, 'Livro nao encontrado')
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const livro = await Livro.remove(req.params.id)
    enviarOu404(res, livro, 'Livro nao encontrado')
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
})

function enviarOu404(res, dados, mensagem) {
  if (!dados) return res.status(404).json({ erro: mensagem })
  return res.json(dados)
}

module.exports = router
