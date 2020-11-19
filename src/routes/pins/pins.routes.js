const PinsService = require('./pins.service')

module.exports = function (router) {
    const pinsService = PinsService();

    router.route('/gpio/obtenerEstadoPins')
        .get(pinsService.obtenerEstadoPins);

    router.route('/gpio/pulsoMaquina')
    .post(pinsService.registrarPulso)

    router.route('/gpio/buzzer/paquete')
    .post(pinsService.buzzerPaquete)
}