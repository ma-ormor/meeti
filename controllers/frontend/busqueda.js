const Sequelize = require('sequelize')
const moment = require('moment')

const Meeti = require('../../models/Meeti')
const Grupo = require('../../models/Grupo')
const Usuario = require('../../models/Usuario')

const Op = Sequelize.Op

exports.resultados = async (req, res)=>{
  let query 

  const {
    categoria, titulo, ciudad, pais} = req.query

  query = 
    categoria === '' ? '' : `where: { categoriumId: ${categoria} }`

  const meetis = await Meeti.findAll({
      where: {
        titulo: {[Op.iLike]: `%${titulo}%`},
        ciudad: {[Op.iLike]: `%${ciudad}%`},
        pais: {[Op.iLike]: `%${pais}%`} },
      include: [
        {model: Grupo, query},
        {model: Usuario, attributes: ['id', 'nombre', 'imagen']} ] 
    })

  res.render('busqueda', {
    pagina: 'Resultados de búsqueda',
    meetis,
    moment })
}//function