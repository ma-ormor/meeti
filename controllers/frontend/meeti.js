const moment = require('moment')
const Sequelize = require('sequelize')

const Meeti = require('../../models/Meeti')
const Grupo = require('../../models/Grupo')
const Usuario = require('../../models/Usuario')
const Categoria = require('../../models/Categoria')
const Comentario = require('../../models/Comentario')

const Op = Sequelize.Op

leerMeeti = async (slug)=>{
  return await Meeti.findOne({
    where: {slug: req.params.slug},
    include: [
      {model: Grupo}, 
      {model: Usuario, attributes: ['id', 'nombre', 'imagen']} ] })
}//function

leerMeetisCercanos = async meeti=>{
  const 
    lat = meeti.ubicacion.coordinates[0],
    lng = meeti.ubicacion.coordinates[1],

    ubicacion = Sequelize.literal(
      `ST_GeomFromText('POINT(${lat} ${lng})')`),
    distancia = Sequelize.fn(
      'ST_DistanceSphere', Sequelize.col('ubicacion'), ubicacion)
  
  return await Meeti.findAll({
    order: distancia,
    where: Sequelize.where(distancia, {[Op.lte]: 2000}),
    limit: 3,
    offset: 1,
    include: [
      {model: Grupo}, 
      {model: Usuario, attributes: ['id', 'nombre', 'imagen']} ] })
}

exports.mostrarMeeti = async (req, res, next)=>{
  const 
  
    meeti = await Meeti.findOne({
      where: {slug: req.params.slug},
      include: [
        {model: Grupo}, 
        {model: Usuario, attributes: ['id', 'nombre', 'imagen']} ] }),

    comentarios = await Comentario.findAll({
      where: {meetiId: meeti.id},
      include: [{
        model: Usuario, 
        attributes: ['id', 'nombre', 'imagen']}] })
  
  if(!meeti) res.redirect('/')

  const cercanos = await leerMeetisCercanos(meeti)

  console.log(cercanos);
  
  res.render('meeti', {
    pagina: meeti.titulo,
    meeti,
    comentarios,
    cercanos,
    moment
  })
}//function

exports.confirmarAsistencia = async (req, res)=>{
  const {accion} = req.body
  
  if(accion === 'confirmar'){
    Meeti.update({
      'interesados': Sequelize.fn(
        'array_append', 
        Sequelize.col('interesados'), 
        req.user.id)
    }, {'where': {'slug': req.params.slug}})

    res.send('Confirmaste tú asistencia')}
  else{
    Meeti.update({
      'interesados': Sequelize.fn(
        'array_remove', 
        Sequelize.col('interesados'), 
        req.user.id)
    }, {'where': {'slug': req.params.slug}})

    res.send('Cancelaste tú asistencia')}
}//function

exports.mostrarAsistentes = async (req, res)=>{
  const 

    meeti = await Meeti.findOne({
      where: {slug: req.params.slug}, 
      attributes: ['interesados'] })

  const asistentes = await Usuario.findAll({
      where: {id: meeti.interesados},
      attributes: ['nombre', 'imagen'] })

  res.render('asistentes-meeti', {
    pagina: 'Asistentes', asistentes })
}//function

exports.mostrarCategoria = async (req, res)=>{
  const 
  
    categoria = await Categoria.findOne({
      where: {slug: req.params.categoria},
      attributes: ['id', 'nombre'] }),

    meetis = await Meeti.findAll({
      order: [
        ['fecha', 'asc'], 
        ['hora', 'asc']],
      include: [
        {model: Grupo, where: {categoriumId: categoria.id}},
        {model: Usuario} ] })
  
  res.render('categoria', {
    pagina: `Meetis de ${categoria.nombre}`,
    meetis, moment })
}//function