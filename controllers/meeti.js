const Grupo = require('../models/Grupo')
const Meeti = require('../models/Meeti')

exports.formNuevoMeeti = async (req, res)=>{
  const grupos = await Grupo.findAll({
    where: {usuarioId: req.user.id} })

  res.render('nuevo-meeti', {
    pagina: 'Nuevo Meeti',
    grupos  
  })
}//function

exports.sanitizarMeeti = (req, res, next)=>{
  //const campos = ['titulo', 'invitado']

  //campos.forEach(campo=>req.sanitizeBody(campo))

  req.sanitizeBody('titulo')
  req.sanitizeBody('invitado')
  req.sanitizeBody('cupo')
  req.sanitizeBody('fecha')
  req.sanitizeBody('hora')
  req.sanitizeBody('direccion')
  req.sanitizeBody('ciudad')
  req.sanitizeBody('estado')
  req.sanitizeBody('pais')
  req.sanitizeBody('lat')
  req.sanitizeBody('pais')
  req.sanitizeBody('grupoId')

  next()
}//function

exports.crearMeeti = async (req, res)=>{
  const datos = req.body

  const point = {type: 'Point', coordinates: [
    parseFloat(req.body.lat),
    parseFloat(req.body.lng) ]}

  datos.usuarioId = req.user.id
  datos.ubicacion = point
  datos.cupo = 0  

  try{
    await Meeti.create(datos)
    req.flash('exito', 'Creaste un nuevo meeti')
    res.redirect('/administracion')
  }catch(e){
    console.log(e)
    const errores = e.errors?.map(error=>error.message)
    req.flash('error', errores)
    res.redirect('/nuevo-meeti')
  }
}//function

exports.formEditarMeeti = async (req, res, next)=>{
  const [grupos, meeti] = await Promise.all([
    Grupo.findAll({where: {usuarioId: req.user.id}}),
    Meeti.findByPk(req.params.id) ])

  if(!grupos || !meeti){ 
    req.flash('error', 'No tienes permiso')
    res.redirect('/administracion')
    return next() }
  
  res.render('editar-meeti2', {
    pagina: `Editar ${meeti.titulo}`,
    grupos,
    meeti
  })
}//function

exports.editarMeeti = async(req, res, next)=>{
  const meeti = await Meeti.findOne({
    where: {id: req.params.id, usuarioId: req.user.id} })
  
  if(!meeti){ 
    req.flash('error', 'El meeti no existe')
    res.redirect('/administracion')
    return next() }
  
  const 
    datos = req.body,
    point = {
      type: 'Point', 
      coordinates: [parseFloat(datos.lat), parseFloat(datos.lng)] } 

  meeti.grupoId = datos.grupoId
  meeti.titulo = datos.titulo
  meeti.invitado = datos.invitado
  meeti.fecha = datos.fecha
  meeti.hora = datos.hora
  meeti.cupo = datos.cupo
  meeti.descripcion = datos.descripcion
  meeti.direccion = datos.direccion
  meeti.ciudad = datos.ciudad
  meeti.estado = datos.estado
  meeti.pais = datos.pais
  meeti.ubicacion = point

  await meeti.save()
  req.flash('exito', 'Cambios guardados')
  res.redirect('/administracion')
}//function

exports.formEliminarMeeti = async (req, res, next)=>{
  const meeti = await Meeti.findOne(
    {where: {id: req.params.id, usuarioId: req.user.id }})
  
  if(!meeti){
    req.flash('error', 'Operación no válida')
    res.redirect('/administracion')
    return next()}

  res.render('eliminar-meeti', {
    pagina: `Eliminar Meeti ${meeti.titulo}` })
}//function

exports.eliminarMeeti = async (req, res, next)=>{
  await Meeti.destroy(
    {where: {id: req.params.id, usuarioId: req.user.id }})
    
  req.flash('exito', 'Meeti Eliminado')
  res.redirect('/administracion')
}//function