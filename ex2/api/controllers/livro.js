const Livro = require('../models/livro')

module.exports.list = (pesquisa) => {
  return Livro.find(filtroPesquisa(pesquisa))
    .sort({ titulo: 1 })
    .exec()
}

module.exports.insert = (dados) => {
  const livro = new Livro({
    titulo: dados.titulo,
    autor: dados.autor,
    paginas: dados.paginas,
    genero: dados.genero,
    lido: dados.lido || false
  })

  return livro.save()
}

module.exports.updateEstado = (id, lido) => {
  return Livro.findByIdAndUpdate(
    id,
    { lido },
    { new: true, runValidators: true }
  ).exec()
}

module.exports.remove = (id) => {
  return Livro.findByIdAndDelete(id).exec()
}

function filtroPesquisa(pesquisa) {
  if (!pesquisa) return {}

  const termo = new RegExp(escaparRegex(pesquisa), 'i')
  return { $or: [{ titulo: termo }, { autor: termo }] }
}

function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
