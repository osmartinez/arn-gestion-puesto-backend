const device = process.env.DEVICE_ENV ||'raspi'
let GpioConfiguracion = null
if(device == 'raspi'){
    GpioConfiguracion = require('../../lib/pins/gpio.config')
}

function PinsService() {

    async function obtenerEstadoPins(req, res, next) {
        if(device == 'raspi'){
            res.json(GpioConfiguracion.PINS)
        }
        else{
            res.json({})
        }
    }

    return {
        obtenerEstadoPins,

    }
}

module.exports = PinsService;