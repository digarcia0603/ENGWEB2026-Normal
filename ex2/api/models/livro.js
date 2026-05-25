const mongoose = require('mongoose')
const { Schema } = mongoose

const livroSchema = new Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  paginas: { type: Number, required: true },
  genero: { type: String, required: true },
  lido: { type: Boolean, default: false }
}, { versionKey: false })

module.exports = mongoose.model('livro', livroSchema, 'livros')
