const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

const usuarios = require('../models/Usuario')
const email = require('../handlers/emails')

exports.formCrearCuenta = (req, res)=>{
  res.render('crear-cuenta', {
    pagina: 'Crear Cuenta'
  })
}//function

exports.crearCuenta = async (req, res)=>{
  const usuario = req.body

  req.checkBody('r_password', 'Repetir contraseña está vacía')
    .notEmpty()
  req.checkBody('r_password', 'Las contraseñas son diferentes')
    .equals(usuario.password)
  const erroresExpress = req.validationErrors()

  try{
    await usuarios.create(usuario)

    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`

    await email.enviar({
      usuario,
      url,
      subject: 'Confirma tu cuenta en Meeti',
      archivo: 'confirma-cuenta'
    })
    req.flash('exito', 'Confirma tu cuenta, revisa tu correo')
    res.redirect('/iniciar-sesion')}
  catch(error){
    console.log(error)

    const errores = [
      ...error.errors.map(error=>error.message),
      ...erroresExpress.map(error=>error.msg)]
    req.flash('error', errores)
    res.redirect('/crear-cuenta')}
}//function

exports.confirmarCuenta = async (req, res, next)=>{
  // const {correo: email} = req.params
  const usuario = await usuarios.findOne({where: {email: req.params.correo}})

  if(!usuario){
    req.flash('error', 'No existe esa cuenta')
    res.redirect('/crear-cuenta')
    return next() }

  usuario.activo = 1
  await usuario.save()
  req.flash('exito', 'La cuenta se confirmó, inicia sesión')
  res.redirect('/iniciar-sesion')
}//function

exports.formIniciarSesion = async (req, res)=>{
  res.render('iniciar-sesion', {
    pagina: 'Inicia Sesión'
  })
}//function

exports.formEditarPerfil = async (req, res)=>{
  const usuario = await usuarios.findByPk(req.user.id)

  res.render('editar-perfil', {
    pagina: 'Editar Pérfil',
    usuario
  })
}//function

exports.editarPerfil = async (req, res)=>{
  const usuario = await usuarios.findByPk(req.user.id)
  req.sanitizeBody('nombre')
  req.sanitizeBody('email')
  const {nombre, descripcion, email} = req.body

  usuario.nombre = nombre
  usuario.descripcion = descripcion
  usuario.email = email

  await usuario.save()
  req.flash('exito', 'Cambios Guardados')
  res.redirect('/administracion')
}//function

exports.formCambiarContrasena = (req, res, next)=>{
  res.render('cambiar-password', {
    pagina: 'Cambia tú contraseña'})
}//function

exports.cambiarContrasena = async (req, res, next)=>{
  const usuario = await usuarios.findByPk(req.user.id)

  if(!usuario);

  if(!usuario.validarPassword(req.body.contrasena)){
    req.flash('error', 'Contraseña incorrecta')
    res.redirect('back')
    return next()}

  const password = usuario.encrypt(req.body.nuevo)
  usuario.password = password

  await usuario.save()

  req.logout(()=>{console.log('error')})
  req.flash('exito', 'Cambios Guardados')
  res.redirect('/iniciar-sesion')
}//function

exports.formImagenPerfil = async (req, res)=>{
  const usuario = await usuarios.findByPk(req.user.id)

  res.render('imagen-perfil', {
    pagina: 'Cambia tú Imagen de Pérfil',
    usuario})
}//function

/* Imágenes de Pérfil */

const configuracion = {
  limits: {fileSize: 100000},
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, next)=>{
      next(null, __dirname+'/../public/uploads/perfiles') },
    filename: (req, file, next)=>{
      const extension = file.mimetype.split('/')[1]
      next(null, `${shortid.generate()}.${extension}`) }
  }),
  fileFilter(req, file, next){
    if(file.mimetype === 'image/jpeg' 
    || file.mimetype === 'image/png')
      next(null, true)
    else next(new Error('Formato no válido '+file.mimetype), false)
  }
}

const upload = multer(configuracion).single('imagen')

const revisar = (error, req, res)=>{
  // Es MulterError
  if(error instanceof multer.MulterError)
    if(error.code === 'LIMIT_FILE_SIZE')
      req.flash('error', 'El archivo es grande')
    else req.flash('error', error.message)
  // No es MulterError
  else if(error.hasOwnProperty('message'))
    req.flash('error', error.message)
  res.redirect('back') 
}//function

exports.subirImagenPerfil = async (req, res, next)=>{
  upload(req, res, function(error){
    if(!error)
      return next() 
    revisar(error, req, res) })
}//function

exports.guardarImagenP = async (req, res)=>{
  const usuario = await usuarios.findByPk(req.user.id)

  // Quitar foto pasada
  if(req.file && usuario.imagen){
    const imagenAnterior 
      = __dirname + `/../public/uploads/perfiles/${usuario.imagen}`
    fs.unlink(imagenAnterior, error=>{
      if(error)
        return console.log(error) }) }
        
  // Guardar imagen
  if(req.file)
    usuario.imagen = req.file.filename 
    
  await usuario.save()
  req.flash('exito', 'Cambios Guardados')
  res.redirect('/administracion')
}//function