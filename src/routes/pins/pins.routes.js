const PinsService = require('./pins.service')

module.exports = function (router) {
    const pinsService = PinsService();

    router.route('/gpio/obtenerEstadoPins')
        .get(pinsService.obtenerEstadoPins);

}