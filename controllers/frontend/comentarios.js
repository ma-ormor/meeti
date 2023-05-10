const Comentario = require('../../models/Comentario')
const Meeti = require('../../models/Meeti')

exports.crearComentario = async (req, res, next)=>{
  const {comentario} = req.body

  await Comentario.create({
    mensaje: comentario,
    usuarioId: req.user.id,
    meetiId: req.params.id
  })

  res.redirect('back'); next()
}//function

exports.eliminarComentario = async (req, res, next)=>{
  const {comentario: id} = req.body

  const 
    comentario = await Comentario.findOne({where: {id} }),
    meeti = await Meeti.findOne({where: {id: comentario.meetiId}})

  if(!comentario){
    res.status(404).send('Operación no válida')
    return next() }
  
  if(meeti.usuarioId !== req.user.id)
    if(comentario.usuarioId !== req.user.id){
      res.status(403).send('Operación no válida')
      return next() }

  await Comentario.destroy({where: {id: comentario.id}})

  res.status(200).send('Eliminaste el comentario'); next()
}//function
