const Sequelize = require('sequelize')
const db = require('../config/db')

const Categoria = db.define('categoria', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true },
  nombre: Sequelize.TEXT,
  slug: Sequelize.TEXT
}, {timestamps: false})

module.exports = Categoria