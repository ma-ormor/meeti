import {OpenStreetMapProvider} from "leaflet-geosearch"

import asistencia from "./asistencia.js"
import comentario from "./comentario.js"

const 
  geocodeService = L.esri.Geocoding.geocodeService(),
  lat = document.querySelector('#lat')?.value || 20.7,
  lng = document.querySelector('#lng')?.value || -103.4,
  direccion = document.querySelector('#direccion')?.value || '',
  map = L.map('mapa').setView([lat, lng], 16)

let 
  markers = new L.FeatureGroup().addTo(map),
  marker

if(lat){
  marker = L.marker([lat, lng], {
    draggable: true, 
    autoPan: true
  }).bindPopup(direccion).openPopup()

  markers.addLayer(marker)

  marker.on('moveend', function(e){
    const marker = e.target
    const posicion = marker.getLatLng()

    map.panTo(new L.LatLng(posicion.lat, posicion.lng))

    geocodeService.reverse().latlng(posicion, 15)
      .run(function(error, resultado){
        llenarInputs(resultado)
        marker.bindPopup(resultado.address.LongLabel) }) 
  })
}

document.addEventListener('DOMContentLoaded', ()=>{
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  const buscador = document.querySelector('#formbuscador')

  buscador.addEventListener('input', buscarDireccion) })

function buscarDireccion(e){
  if(e.target.value.length > 8){
    const provider = new OpenStreetMapProvider()

    markers.clearLayers()

    provider
      .search({query: e.target.value})
      .then(resultado=>{
        geocodeService.reverse().latlng(resultado[0].bounds[0], 15)
          .run(function(error, respuesta){
            llenarInputs(respuesta)
          
            moverMapa(resultado, geocodeService) })
      })
  }
}//function

function moverMapa(resultado, geocodeService){
  map.setView(resultado[0].bounds[0], 15)

  marker = L.marker(resultado[0].bounds[0], {
    draggable: true, 
    autoPan: true
  }).addTo(map).bindPopup(resultado[0].label).openPopup()

  markers.addLayer(marker)

  marker.on('moveend', function(e){
    const marker = e.target
    const posicion = marker.getLatLng()

    map.panTo(new L.LatLng(posicion.lat, posicion.lng))

    geocodeService.reverse().latlng(posicion, 15)
      .run(function(error, resultado){
        llenarInputs(resultado)
        marker.bindPopup(resultado.address.LongLabel) }) 
  })
}//function

function leerPin(posicion, resultado, funcion){
  geocodeService
    .reverse()
    .latlng(posicion, 15)
    .run(funcion(error, resultado))
}

function llenarInputs(resultado){
  document.querySelector('#direccion').value = resultado.address.Address || ''
  document.querySelector('#ciudad').value = resultado.address.City || ''
  document.querySelector('#estado').value = resultado.address.Region || ''
  document.querySelector('#pais').value = resultado.address.CountryCode || ''
  document.querySelector('#lat').value = resultado.latlng.lat || ''
  document.querySelector('#lng').value = resultado.latlng.lng || ''
}//function