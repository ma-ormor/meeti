import axios from 'axios'

document.addEventListener('DOMContentLoaded', ()=>{
  const asistencia = document.querySelector('#confirmar-asistencia')

  if(asistencia)
    asistencia.addEventListener('submit', confirmar)
})

function confirmar(e){
  e.preventDefault() // No envía formulario

  let accion = document.querySelector('#accion').value

  const 
    mensaje = document.querySelector('#mensaje'),
    boton = document.querySelector(
      '#confirmar-asistencia input[type="submit"]'),
    datos = {accion}

  while(mensaje.firstChild)
    mensaje.removeChild(mensaje.firstChild)

  axios.post(this.action, datos).then(respuesta=>{
    if(accion === 'confirmar'){
      document.querySelector('#accion').value = 'cancelar'
      boton.value = 'Cancelar'
      boton.classList.remove('btn-azul')
      boton.classList.add('btn-rojo')}
    else{
      document.querySelector('#accion').value = 'confirmar'
      boton.value = 'Sí'
      boton.classList.remove('btn-rojo')
      boton.classList.add('btn-azul')}

    mensaje.appendChild(document.createTextNode(respuesta.data))
  })
}//function