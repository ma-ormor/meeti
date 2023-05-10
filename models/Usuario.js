const Sequelize = require('sequelize')
const db = require('../config/db')
const bcrypt = require('bcrypt-nodejs')

const Usuario = db.define('usuario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: Sequelize.STRING(60),
  imagen: Sequelize.STRING(30),
  descripcion: Sequelize.TEXT,
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
    validate: {isEmail: {msg: 'Escribe un correo válido'}},
    unique: {
      args: true,
      msg: 'Correo ya registrado'
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {msg: 'La contraseña está vacía'}
    }
  },
  activo: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  token: Sequelize.STRING,
  expiraToken: Sequelize.DATE
}, {
  hooks: {
    beforeCreate(usuario) {
      usuario.password = Usuario.prototype.encrypt(usuario.password)}
  }
})

Usuario.prototype.validarPassword = function(password){
  return bcrypt.compareSync(password, this.password)
}//function

Usuario.prototype.encrypt = function(password){
  return bcrypt.hashSync(
    password, bcrypt.genSaltSync(10), null)
}//function

module.exports = Usuario