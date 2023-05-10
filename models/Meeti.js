const Sequelize = require('sequelize')
const uuid = require('uuid/v4')
const slug = require('slug')
const shortid = require('shortid')

const db = require('../config/db')
const Usuario = require('../models/Usuario')
const Grupo = require('../models/Grupo')

const Meeti = db.define('meeti', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuid()
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Escribe el título'} }},
  slug: {
    type: Sequelize.STRING
  },
  invitado: Sequelize.STRING,
  cupo: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una descripción'} }},
  fecha: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una fecha'} }},
  hora: {
    type: Sequelize.TIME,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una hora'} }},
  direccion: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una direccion'} }},
  ciudad: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una ciudad'} }},
  estado: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una estado'} }},
  pais: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Agrega una país'} }},
  ubicacion:
    Sequelize.GEOMETRY('POINT'),
  interesados: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: []
  }
}, {
  hooks: {
    async beforeCreate(meeti){
      const url = slug(meeti.titulo).toLowerCase()
      meeti.slug = `${url}-${shortid.generate()}`
    }
  }
})

Meeti.belongsTo(Usuario)
Meeti.belongsTo(Grupo)

module.exports = Meeti