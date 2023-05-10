const moment = require('moment')
const Sequelize = require('sequelize')

const Categoria = require('../models/Categoria')
const Meeti = require('../models/Meeti')
const Grupo = require('../models/Grupo')
const Usuario = require('../models/Usuario')

const Op = Sequelize.Op

exports.home = async (req, res)=>{
  const fecha = moment(new Date()).format('YYYY-MM-DD')
  const [categorias, meetis] = await Promise.all([
    Categoria.findAll({}),
    Meeti.findAll({
      attributes: ['slug', 'titulo', 'fecha', 'hora'],
      where: {fecha: {[Op.gte]: fecha}},
      limit: 3,
      order: [['fecha', 'asc']],
      include: [
        {model: Grupo, attributes: ['imagen']},
        {model: Usuario, attributes: ['nombre', 'imagen']}
      ] })
  ])

  console.log(meetis);
  console.log('##'+meetis.length+'##');

  res.render('inicio', {
    pagina: 'Inicio',
    categorias,
    meetis,
    moment
  })
}//function