const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const Livro = require('./models/livro')
const livrosRouter = require('./routes/livros')

const app = express()
const HTTP_PORT = process.env.PORT || 19020
const MONGO_URI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/leituras'
const DATASET_FILE = path.join(__dirname, 'dados', 'livros.json')

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/livros', livrosRouter)

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota inexistente' })
})

arrancar()

async function arrancar() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log(`Ligacao ao MongoDB feita: ${MONGO_URI}`)

    await importarLivrosSeNecessario()

    app.listen(HTTP_PORT, '0.0.0.0', () => {
      console.log(`API ex2 na porta ${HTTP_PORT}`)
    })
  } catch (erro) {
    console.error('Erro a iniciar a API:', erro.message)
    process.exit(1)
  }
}

async function importarLivrosSeNecessario() {
  const total = await Livro.countDocuments()
  if (total !== 0) return

  const conteudo = fs.readFileSync(DATASET_FILE, 'utf8')
  const livros = JSON.parse(conteudo)

  await Livro.insertMany(livros)
  console.log(`Importados ${livros.length} livros para a BD.`)
}
