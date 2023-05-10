const moment = require('moment')

const Grupo = require('../../models/Grupo')
const Meeti = require('../../models/Meeti')

exports.mostrarGrupo = async (req, res, next)=>{
  const {id} = req.params
  const [grupo, meetis] = await Promise.all([
    Grupo.findOne({
      where: {id}}),
    Meeti.findAll({
      where: {grupoId: id},
      order: [['fecha', 'asc']] }) ])

  if(!grupo){
    res.redirect('/')
    return next()}

  res.render('grupo', {
    pagina: `Grupo ${grupo.nombre}`,
    grupo, meetis, moment })
}//function