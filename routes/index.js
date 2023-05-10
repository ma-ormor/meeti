const express = require('express')
const {home} = require('../controllers/home')
const {
  formCrearCuenta, crearCuenta, confirmarCuenta, 
  formIniciarSesion, formEditarPerfil, editarPerfil,
  formCambiarContrasena, cambiarContrasena,
  formImagenPerfil, subirImagenPerfil, guardarImagenP} 
  = require('../controllers/usuarios')
const {
  autenticarUsuario, usuarioEntro, cerrarSesion} 
  = require('../controllers/auth')
const {
  mostrarAdministracion} 
  = require('../controllers/admin')
const {
  formNuevoGrupo, subirImagen, crearGrupo, 
  formEditarGrupo, editarGrupo, formEditarImagen, 
  guardarImagen, formEliminarGrupo, eliminarGrupo} 
  = require('../controllers/grupos')
const {
  formNuevoMeeti, crearMeeti, sanitizarMeeti,
  formEditarMeeti, editarMeeti, formEliminarMeeti,
  eliminarMeeti} 
  = require('../controllers/meeti')
const {
  mostrarMeeti, confirmarAsistencia, mostrarAsistentes,
  mostrarCategoria}
  = require('../controllers/frontend/meeti')
const {mostrarUsuario}
  = require('../controllers/frontend/usuarios')
const {mostrarGrupo}
  = require('../controllers/frontend/grupos')
const {crearComentario, eliminarComentario}
  = require('../controllers/frontend/comentarios')
const {resultados}
  = require('../controllers/frontend/busqueda')

const router = express.Router()

module.exports = function(){
  router.get('/', home)
  router.get('/meeti/:slug', mostrarMeeti)
  router.get('/asistentes/:slug', mostrarAsistentes)
  router.get('/usuarios/:id', mostrarUsuario)
  router.get('/grupos/:id', mostrarGrupo)
  router.get('/categoria/:categoria', mostrarCategoria)
  router.get('/busqueda', resultados)

  router.post('/meeti/:id', crearComentario)
  router.post('/eliminar-comentario', eliminarComentario)
  router.post('/confirmar-asistencia/:slug', confirmarAsistencia)

  // BACK END

  // Usuarios
  router.get('/crear-cuenta', formCrearCuenta)
  router.post('/crear-cuenta', crearCuenta)
  // Usuarios
  router.get('/confirmar-cuenta/:correo', confirmarCuenta)
  // Usuarios
  router.get('/iniciar-sesion', formIniciarSesion)
  router.post('/iniciar-sesion', autenticarUsuario)
  // Admin
  router.get('/administracion', usuarioEntro, mostrarAdministracion)
  // Grupos
  router.get('/nuevo-grupo', usuarioEntro, formNuevoGrupo)
  router.post('/nuevo-grupo', usuarioEntro, subirImagen, crearGrupo)
  // Grupos
  router.get('/editar-grupo/:id', usuarioEntro, formEditarGrupo)
  router.post('/editar-grupo/:id', usuarioEntro, editarGrupo)

  router.get('/imagen-grupo/:id', usuarioEntro, formEditarImagen)
  router.post('/imagen-grupo/:id', usuarioEntro, subirImagen, guardarImagen)

  router.get('/eliminar-grupo/:id', usuarioEntro, formEliminarGrupo)
  router.post('/eliminar-grupo/:id', usuarioEntro, eliminarGrupo)

  router.get('/nuevo-meeti', usuarioEntro, formNuevoMeeti)
  router.post('/nuevo-meeti', usuarioEntro, sanitizarMeeti, crearMeeti)

  router.get('/editar-meeti/:id', usuarioEntro, formEditarMeeti)
  router.post('/editar-meeti/:id', usuarioEntro, editarMeeti)

  router.get('/eliminar-meeti/:id', usuarioEntro, formEliminarMeeti)
  router.post('/eliminar-meeti/:id', usuarioEntro, eliminarMeeti)

  router.get('/editar-perfil', usuarioEntro, formEditarPerfil)
  router.post('/editar-perfil', usuarioEntro, editarPerfil)

  router.get('/cambiar-password', usuarioEntro, formCambiarContrasena)
  router.post('/cambiar-password', usuarioEntro, cambiarContrasena)

  router.get('/imagen-perfil', 
    usuarioEntro, formImagenPerfil)
  router.post('/imagen-perfil', 
    usuarioEntro, subirImagenPerfil, guardarImagenP)

  router.get('/salir', usuarioEntro, cerrarSesion)
  
  return router
}