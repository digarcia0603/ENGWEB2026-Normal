const mongoose = require('mongoose')
const { Schema } = mongoose

const autorSchema = new Schema({
  id: String,
  name: String
}, { _id: false })

const editoraSchema = new Schema({
  id: String,
  name: String,
  country: String
}, { _id: false })

const mecanicaSchema = new Schema({
  id: String,
  name: String
}, { _id: false })

const premioSchema = new Schema({
  id: String,
  name: String,
  year: Number
}, { _id: false })

const jogoSchema = new Schema({
  _id: String,
  id: { type: String, required: true },
  name: { type: String, required: true },
  year: Number,
  category: String,
  minPlayers: Number,
  maxPlayers: Number,
  playingTimeMinutes: Number,
  descriptionEN: String,
  autores: [autorSchema],
  editoras: [editoraSchema],
  mecanicas: [mecanicaSchema],
  premios: [premioSchema]
}, { versionKey: false })

jogoSchema.pre('validate', function(next) {
  if (!this._id && this.id) this._id = this.id
  if (!this.id && this._id) this.id = this._id
  next()
})

module.exports = mongoose.model('jogo', jogoSchema, 'jogos')
