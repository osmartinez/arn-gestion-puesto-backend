const express = require('express')
const env = process.env.NODE_ENV || 'production'
const device = process.env.DEVICE_ENV || 'raspi'
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser');
const config = require('./config')
const store = require('./store')
const cors = require('cors')
const { iniciar } = require('./src/lib/pins/gpio.config.js')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var puestoActual = null

const iniciarPuesto = async ()=>{
    while(puestoActual == null){
        try {
            puestoActual = await store.GetPuesto()    
        } catch (error) {
            console.error(error)
        }

        setTimeout(()=>{},2000)
    }
    
    
    // si estoy ejecutando desde la placa, configuro los pins
    if (device == 'raspi') {
        console.log(`[${env} ${device}] arn-gestion-puesto-backend connecting with gpios`)
        const GpioConfiguracion = require('./src/lib/pins/gpio.config.js')
        process.on('SIGINT', _ => {
            console.log('desconectando pins')
            GpioConfiguracion.desconectar()
        });
        GpioConfiguracion.iniciar()
        if (puestoActual != null && puestoActual.Id) {
            GpioConfiguracion.configurarPuesto(puestoActual)
        }
    }
}

iniciarPuesto()



const router = require('./src/routes/index')()
app.use('/backend',router)

const serverPort = config[env].server.port
const server = app.listen(serverPort, () => {
    console.log(`[${env} ${device}] arn-gestion-puesto-backend up and running on port ${serverPort}`)
})



module.exports = server
