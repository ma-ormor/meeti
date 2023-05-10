const moment = require('moment')
const sequelize = require('sequelize')

const grupo = require('../models/Grupo')
const Meeti = require('../models/Meeti')

const Op = sequelize.Op

exports.mostrarAdministracion = async (req, res)=>{
  const fecha = moment(new Date()).format('YYYY-MM-DD')
  const [grupos, meetis, pasados] = await Promise.all([
    grupo.findAll({where: {usuarioId: req.user.id}}),
    Meeti.findAll({where: {
      usuarioId: req.user.id,
      fecha: {[Op.gte]: fecha}
    }, order: [['fecha', 'asc']] }),
    Meeti.findAll({where: {
      usuarioId: req.user.id,
      fecha: {[Op.lt]: fecha}
    }}) ])

  res.render('admin', {
    pagina: 'Panel de Administración',
    grupos,
    meetis,
    pasados,
    moment })
}//function