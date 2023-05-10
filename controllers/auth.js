const passport = require('passport')

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/administracion',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Llena los dos campos'
})

exports.usuarioEntro = (req, res, next)=>{
  if(req.isAuthenticated())
    return next()
  res.redirect('/iniciar-sesion')
}//function

exports.cerrarSesion = (req, res, next)=>{
  req.logout(()=>console.log('Error'))
  req.flash('exito', 'Sesión Cerrada Successfully')
  res.redirect('/iniciar-sesion')
  next()
}//f