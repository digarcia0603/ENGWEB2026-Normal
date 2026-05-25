const Jogo = require('../models/jogo')

const camposLista = { _id: 0, id: 1, name: 1, year: 1, category: 1, minPlayers: 1 }
const camposPorEditora = { _id: 0, id: 1, name: 1, year: 1 }

module.exports.list = (editora) => {
  const filtro = editora ? filtroPorEditora(editora) : {}
  const campos = editora ? camposPorEditora : camposLista

  return Jogo.find(filtro, campos)
    .sort({ name: 1 })
    .exec()
}

module.exports.findById = (id) => {
  return Jogo.findOne(filtroPorId(id)).exec()
}

module.exports.insert = (dados) => {
  const jogo = prepararIdentificadores(dados)
  return new Jogo(jogo).save()
}

module.exports.update = (id, dados) => {
  const alteracoes = { ...dados }

  delete alteracoes._id
  if (alteracoes.id && alteracoes.id !== id) delete alteracoes.id

  return Jogo.findOneAndUpdate(
    filtroPorId(id),
    alteracoes,
    { new: true, runValidators: true }
  ).exec()
}

module.exports.remove = (id) => {
  return Jogo.findOneAndDelete(filtroPorId(id)).exec()
}

module.exports.autores = () => {
  return Jogo.aggregate([
    { $unwind: '$autores' },
    {
      $group: {
        _id: { id: '$autores.id', nome: '$autores.name' },
        jogos: { $addToSet: { id: '$id', nome: '$name' } }
      }
    },
    { $project: { _id: 0, id: '$_id.id', nome: '$_id.nome', jogos: 1 } },
    { $sort: { nome: 1 } }
  ]).exec()
}

module.exports.categorias = () => {
  return Jogo.aggregate([
    {
      $group: {
        _id: '$category',
        jogos: { $addToSet: { id: '$id', nome: '$name' } }
      }
    },
    { $project: { _id: 0, categoria: '$_id', jogos: 1 } },
    { $sort: { categoria: 1 } }
  ]).exec()
}

function filtroPorId(id) {
  return { $or: [{ _id: id }, { id }] }
}

function filtroPorEditora(editora) {
  const termo = new RegExp(`^${escaparRegex(editora)}$`, 'i')

  return {
    $or: [
      { 'editoras.name': termo },
      { 'editoras.id': termo }
    ]
  }
}

function prepararIdentificadores(dados) {
  const jogo = { ...dados }

  if (jogo.id && !jogo._id) jogo._id = jogo.id
  if (jogo._id && !jogo.id) jogo.id = jogo._id

  return jogo
}

function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
