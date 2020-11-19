const TareaNoSQLWebservice = require('../../lib/repository/tareaNoSQL.ws')
const device = process.env.DEVICE_ENV || 'raspi'
let GpioConfiguracion = null
if (device == 'raspi') {
    GpioConfiguracion = require('../../lib/pins/gpio.config')
}

function PinsService() {

    async function obtenerEstadoPins(req, res, next) {
        if (device == 'raspi') {
            res.json(GpioConfiguracion.PINS)
        }
        else {
            res.json({})
        }
    }

    async function registrarPulso(req, res, next) {
        const { IdPuesto, PinPulso, ProductoPorPulso } = req.body
        try {
            if (device == 'raspi') {
                GpioConfiguracion.PINS[PinPulso].pulsesUp.pop()
            }
            const msg = await TareaNoSQLWebservice.sumarPares(IdPuesto, ProductoPorPulso)
            return res.json(msg)
        } catch (error) {
            return res.status(500).json({ message: String(error) })
        }
    }

    async function buzzerPaquete(req, res, next) {
        const { pinBuzzer } = req.body
        console.log(req.body)
        try {
            if (device == 'raspi' && pinBuzzer !== 'null') {
                GpioConfiguracion.escribirValor(pinBuzzer,1)
                setTimeout(()=>{GpioConfiguracion.escribirPulso(pinBuzzer,0)},1000)
                return res.json({message: 'ok'})
            }
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: String(error) })
        }
    }

    return {
        obtenerEstadoPins,
        registrarPulso,
        buzzerPaquete
    }
}

module.exports = PinsService;