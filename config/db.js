const Sequelize = require('sequelize')

require('dotenv').config({path: '../.env'})

module.exports = new Sequelize('meeti', 'postgres', 'pass', {
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  dialect: 'postgres',
  pool: {
    max: 5, min: 0, acquire: 30000, idle: 10000
  },
  //define: {timestamps: false},
  //loggin: false
})