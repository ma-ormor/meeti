const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

const db = require('../config/db')
const categoria = require('./Categoria')
const usuario = require('./Usuario')

const Grupo = db.define('grupo', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuid() },
  nombre: {
    type: Sequelize.TEXT(100),
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Revisa el Nombre'} }},
  descripcion: {
    type: Sequelize.TEXT(100),
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Escribe una Descripción'} }},
  url: Sequelize.TEXT,
  imagen: Sequelize.TEXT
})

Grupo.belongsTo(categoria)
Grupo.belongsTo(usuario)

module.exports = Grupo