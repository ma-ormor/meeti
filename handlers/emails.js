const nodemailer = require('nodemailer')
const fs = require('fs')
const util = require('util')
const ejs = require('ejs')

let transport = nodemailer.createTransport({
  host:  "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f1f49e726ab9ae",
    pass: "b0eb803ea82a38"}
})

exports.enviar = async (opciones)=>{  
  const archivo = __dirname+`/../views/emails/${opciones.archivo}.ejs`
  const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'))
  const html = compilado({url: opciones.url})

  const opcionesEmail = {
    from: 'Meeti <noreply@meeti.com>',
    to: opciones.usuario.email,
    subject: opciones.subject,
    html }

  const sendMail = util.promisify(transport.sendMail, transport)
  return sendMail.call(transport, opcionesEmail)
}//function