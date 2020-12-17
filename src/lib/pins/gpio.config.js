const Gpio = require('onoff').Gpio
const PINS = {}
let broker = null
const pinCount = 26

function setBroker(brokerNew) {
    broker = brokerNew
}

function iniciar() {
    for (let i = 1; i <= 26; i++) {
        PINS[`GPIO${i}`] = {
            number: i,
            mode: 'in',
            status: 'off',
            value: 0,
            gpio_object: null,
            previous_value: 0,
            pulsesUp: [],
            pulsesDown: [],
            depends_on: -1,
            type: null,
            ultimaLectura: null
        }
    }
}

function configurarPuesto(puesto) {
    PINS[puesto.PinBuzzer].gpio_object = new Gpio(PINS[puesto.PinBuzzer].number,'out')
    PINS[puesto.PinBuzzer].status = 'on'
    // entradas
    for (const maquina of puesto.Maquinas) {
        if (!maquina.EsPulsoManual) {
            if (maquina.PinPulso != null && maquina.PinPulso != 'null') {
                console.log(`${maquina.PinPulso}`)
                PINS[maquina.PinPulso].mode = 'in'
                PINS[maquina.PinPulso].status = 'on'
                PINS[maquina.PinPulso].flanco = 'up'
                PINS[maquina.PinPulso].type = 'main-pulse'

                try {
                    PINS[maquina.PinPulso].gpio_object = new Gpio(PINS[maquina.PinPulso].number, PINS[maquina.PinPulso].mode, maquina.DisparoPulso, { debounceTimeout: 0/*maquina.ValorBouncingPulso*/ })
                    PINS[maquina.PinPulso].gpio_object.watch((err, value) => {
                        if (err) {
                            console.error(err)
                        }
                        else {
                            const fecha = new Date()
                            const n = fecha.getTime()
                            const resta =  n - (PINS[maquina.PinPulso].ultimaLectura == null? 0:  PINS[maquina.PinPulso].ultimaLectura)
                            if (PINS[maquina.PinPulso].depends_on > 0) {
                                const pulsoDependiente = PINS[maquina.PinPulso2].gpio_object.readSync()
                                if (pulsoDependiente == maquina.ValorPulsoDependiente) {

                                    if (resta > maquina.ValorBouncingPulso) {
                                        console.log(`${resta}>${maquina.ValorBouncingPulso}`)
                                        console.log("PULSO!")
                                        PINS[maquina.PinPulso].ultimaLectura = n
                                        //PINS[maquina.PinPulso].pulsesUp.push(1)
                                        broker.publish({ topic: '/puesto/pulso', payload: JSON.stringify({ maquinaId: maquina.ID, pinPulso: maquina.PinPulso }) })
                                    }

                                }
                            }
                            else {
                                if (resta > maquina.ValorBouncingPulso) {
                                    console.log("PULSO!")
                                    PINS[maquina.PinPulso].ultimaLectura = n
                                    //PINS[maquina.PinPulso].pulsesUp.push(1)
                                    broker.publish({ topic: '/puesto/pulso', payload: JSON.stringify({ maquinaId: maquina.ID, pinPulso: maquina.PinPulso }) })
                                }

                            }
                        }
                    })
                } catch (err) {
                    console.error(`Error al abrir el ${maquina.PinPulso}`)
                }

                if (maquina.PinPulso2 != null && maquina.PinPulso2 != 'null') {
                    PINS[maquina.PinPulso].depends_on = Number(maquina.PinPulso2.replace('GPIO', ''))

                    PINS[maquina.PinPulso2].mode = 'in'
                    PINS[maquina.PinPulso2].status = 'on'

                    try {
                        PINS[maquina.PinPulso2].gpio_object = new Gpio(PINS[maquina.PinPulso2].number, PINS[maquina.PinPulso2].mode)
                    } catch (err) {
                        console.error(`Error al abrir el ${maquina.PinPulso2}`)
                    }
                }
            }
        }
    }

}


function escribirValor(pin, valor) {
    if (PINS[pin].status == 'on') {
        PINS[pin].gpio_object.writeSync(valor)
    }
    else {
        
        throw new Error(`${pin} está apagado`)
    }
}

function desconectar() {
    for (const pin in PINS) {
        if (PINS[pin].gpio_object != null) {
            PINS[pin].gpio_object.unexport()
        }
    }
}

module.exports = {
    iniciar: iniciar,
    escribirValor: escribirValor,
    //refrescarValoresLectura: refrescarValoresLectura,
    setBroker: setBroker,
    PINS: PINS,
    configurarPuesto: configurarPuesto,
    desconectar: desconectar,
}


