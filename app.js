require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const config = require('config')


const app =express();

app.use(bodyParser.json())

app.listen(process.env.PORT, ()=>{
    console.log('server ready in localhost ', process.env.PORT)
    
})

app.get('/',(req, res)=>{
    res.send('Se a cargado correctamente la prueba del bot de Prestamype, by HANS')
})

// Configuración global de rutas
app.use(require('./routes/webhook'));
app.use(require('./routes/setup'));


