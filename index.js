const express = require('express')
const path = require('path')
const layouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookie = require('cookie-parser')
const expressValidator = require('express-validator')

const router = require('./routes/index')
const db = require('./config/db')
const passport = require('./config/passport')

require('dotenv').config({path: '.env'})

// Actualiza tablas
require('./models/Usuario')
require('./models/Categoria')
require('./models/Grupo')
require('./models/Meeti')
require('./models/Comentario')

db.sync()
  .then(()=>console.log('Conexión hecha'))
  .catch(error=>console.log(error))

const app = express()
// Post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// Validación
app.use(expressValidator())
// Plantillas
app.use(layouts)
app.set('view engine', 'ejs')
// Vistas
app.set('views', path.join(__dirname, './views'))
// Público
app.use(express.static('public'))
//
app.use(cookie())
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
// Alertas 
app.use(flash())
// Middleware | login, mensajes, fecha
app.use((req, res, next)=>{
  const fecha = new Date()
  res.locals.anio = fecha.getFullYear()
  res.locals.usuario = {...req.user} || null
  res.locals.mensajes = req.flash()
  next()
})
// Rutas
app.use('/', router())

// Puerto
const host = process.env.HOST || '0.0.0.0'
const puerto = process.env.PORT || 5000

app.listen(process.env.PORT, ()=>{
  console.log(`localhost:${process.env.PORT}`) })