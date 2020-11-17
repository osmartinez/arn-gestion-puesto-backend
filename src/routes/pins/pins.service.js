const TareaNoSQLWebservice = require('../../lib/repository/tareaNoSQL.ws')
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
            /*res.json({
                "GPIO14":{
                    flanco :'up',
                    mode: 'in',
                    type: 'main-pulse',
                    status: 'on',
                    pulsesUp:[1,1]
                }
            })*/
            res.json({})
        }
    }

    async function registrarPulso(req,res, next){
        const {IdPuesto, ProductoPorPulso} = req.body
        try {
            const msg = await TareaNoSQLWebservice.sumarPares(IdPuesto,ProductoPorPulso)
            return res.json(msg)
        } catch (error) {
            return res.status(500).json({message: String(error)})
        }
    }

    return {
        obtenerEstadoPins,
        registrarPulso,
    }
}

module.exports = PinsService;