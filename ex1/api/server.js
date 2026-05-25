const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const fs = require('fs')
const path = require('path')

const Jogo = require('./models/jogo')
const jogosRouter = require('./routes/jogos')
const autoresRouter = require('./routes/autores')
const categoriasRouter = require('./routes/categorias')

const app = express()
const HTTP_PORT = process.env.PORT || 17000
const MONGO_URI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/jogostabuleiro'
const DATASET_FILE = path.join(__dirname, 'dados', 'jogos.json')

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/jogos', jogosRouter)
app.use('/autores', autoresRouter)
app.use('/categorias', categoriasRouter)

const swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota inexistente' })
})

arrancar()

async function arrancar() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log(`Ligacao ao MongoDB feita: ${MONGO_URI}`)

    await importarJogosSeNecessario()

    app.listen(HTTP_PORT, '0.0.0.0', () => {
      console.log(`API ex1 na porta ${HTTP_PORT}`)
    })
  } catch (erro) {
    console.error('Erro a iniciar a API:', erro.message)
    process.exit(1)
  }
}

async function importarJogosSeNecessario() {
  const total = await Jogo.countDocuments()
  if (total !== 0) return

  const conteudo = fs.readFileSync(DATASET_FILE, 'utf8')
  const jogos = JSON.parse(conteudo).map(jogo => ({
    ...jogo,
    _id: jogo.id
  }))

  await Jogo.insertMany(jogos)
  console.log(`Importados ${jogos.length} jogos para a BD.`)
}
