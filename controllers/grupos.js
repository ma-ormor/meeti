const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

const categoria = require('../models/Categoria')
const Grupo = require('../models/Grupo')

exports.formNuevoGrupo = async (req, res)=>{
  const categorias = await categoria.findAll()

  res.render('nuevo-grupo', {
    pagina: 'Nuevo Grupo',
    categorias
  })//render
}//function

exports.crearGrupo = async (req, res)=>{
  req.sanitizeBody('nombre')
  req.sanitizeBody('url')

  const nuevo = req.body

  nuevo.descripcion = 'Nada'
  nuevo.categoriumId = req.body.categoria
  nuevo.usuarioId = req.user.id
  nuevo.imagen = req.file?.filename

  try{
    await Grupo.create(nuevo)
    req.flash('exito', 'Creaste un nuevo grupo')
    res.redirect('/administracion') 
  }catch(e){
    const errores = e.errors.map(error=>error.message)
    req.flash('error', errores)
    res.redirect('back') 
  }//try
}//function

const configuracion = {
  limits: {fileSize: 100000},
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, next)=>{
      next(null, __dirname+'/../public/uploads/grupos') },
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

exports.subirImagen = async (req, res, next)=>{
  upload(req, res, function(error){
    if(!error)
      return next() 
    revisar(error, req, res) })
}//function

exports.formEditarGrupo = async (req, res)=>{
  // const consultas = []
  // consultas.push(grupo.findByPk(req.params.id))
  // consultas.push(categoria.findAll())

  const [grupof, categorias] = await Promise.all([
    Grupo.findByPk(req.params.id), 
    categoria.findAll() ])
  
  res.render('editar-grupo', {
    pagina: `Editar ${grupof.nombre}`,
    grupo: grupof,
    categorias
  })
}//function

exports.editarGrupo = async (req, res, next)=>{
  const grupof = await Grupo.findOne(
    {where: {
      id: req.params.id, 
      usuarioId: req.user.id }})

  if(!grupof){
    req.flash('error', 'El grupo no existe')
    res.redirect('/administracion')
    return next() }

  const {nombre, descripcion, cateogia, url} = req.body

  grupof.nombre = nombre
  grupof.descripcion = descripcion
  grupof.categoria = categoria
  grupof.url = url

  await grupof.save()
  req.flash('exito', 'Cambios Guardados')
  res.redirect('/administracion')
}//

exports.formEditarImagen = async (req, res)=>{
  const grupo = await Grupo.findOne(
    {where: {
      id: req.params.id, 
      usuarioId: req.user.id }})

  res.render('imagen-grupo', {
    pagina: `Editar Imagen en ${grupo.nombre}`, grupo
  })
}//function

exports.guardarImagen = async (req, res, next)=>{
  const grupo = await Grupo.findOne(
    {where: {
      id: req.params.id, 
      usuarioId: req.user.id }})

  if(!grupo){
    req.flash('error', 'Operación no Válida')
    res.redirect('/administracion')
    return next() }

  if(req.file && grupo.imagen){
    const imagenAnterior 
      = __dirname + `/../public/uploads/grupos/${grupo.imagen}`
    fs.unlink(imagenAnterior, error=>{
      if(error)
        return console.log(error) }) }
  
  if(req.file)
    grupo.imagen = req.file.filename 
  await grupo.save()
  req.flash('exito', 'Cambios Guardados')
  res.redirect('/administracion')
}//function

exports.formEliminarGrupo = async (req, res, next)=>{
  const grupo = await Grupo.findOne(
    {where: {
      id: req.params.id, 
      usuarioId: req.user.id }})
  
  if(!grupo){
    req.flash('error', 'Operación no válida')
    res.redirect('/administracion')
    return next() }

  res.render('eliminar-grupo', {
    pagina: `Eliminar ${grupo.nombre}` })
}//function

exports.eliminarGrupo = async (req, res, next)=>{
  const grupo = await Grupo.findOne(
    {where: {
      id: req.params.id, 
      usuarioId: req.user.id }})
  
  if(!grupo){
    req.flash('error', 'Operación no válida')
    res.redirect('/administracion')
    return next() }

  if(grupo.imagen){
    const imagen 
      = __dirname + `/../public/uploads/${grupo.imagen}`
    fs.unlink(imagen, error=>{
      if(error)
        return console.log(error) })
  }

  await Grupo.destroy({where: {id: req.params.id}})
  req.flash('exito', 'Grupo Eliminado')
  res.redirect('/administracion')
}//function