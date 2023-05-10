import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', ()=>{
  const forms = document.querySelectorAll('.eliminar-comentario')

  if(forms.length)
    forms.forEach(eliminar=>{
      eliminar.addEventListener('submit', eliminarComentario)
    })
})

function eliminarComentario(e){
  e.preventDefault()

  Swal.fire({
    title: '¿Eliminar Comentario?',
    text: "Se eliminará para siempre",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      const 
        comentario = this.children[0].value,
        datos = {comentario}

      axios.post(this.action, datos)
        .then(respuesta=>{
          this.parentElement.parentElement.remove() })
        .catch(error=>{
          if(
            error.response.status === 403 || 
            error.response.status === 404) 
            
            Swal.fire( 'Error', error.response.data, 'error' ) })
    } })
}//function