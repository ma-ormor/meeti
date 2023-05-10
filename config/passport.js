const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const usuarios = require('../models/Usuario')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, next)=>{
  const usuario = await usuarios.findOne({where: {email, activo: 1}})

  if(!usuario)
    return next(null, false, {
      message: 'El usuario no existe'
    })

  const contraseñaValida = usuario.validarPassword(password)

  if(!contraseñaValida) 
    return next(null, false, {
      message: 'La contraseña es mal'
    })

  return next(null, usuario)
}))

passport.serializeUser(function(usuario, done){
  done(null, usuario) })

passport.deserializeUser(function(usuario, done){
  done(null, usuario) })

module.exports = passport
