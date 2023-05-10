const Usuario = require('../../models/Usuario')
const Grupo = require('../../models/Grupo')

exports.mostrarUsuario = async (req, res, next)=>{
  const [perfil, grupos] = await Promise.all([
    Usuario.findOne({where: {id: req.params.id}}),
    Grupo.findAll({where: {usuarioId: req.params.id}})
  ])

  if(!perfil){
    res.redirect('/')
    return next()}

  res.render('perfil', {
    pagina: `Pérfil de ${perfil.nombre}`,
    perfil, 
    grupos
  })
}