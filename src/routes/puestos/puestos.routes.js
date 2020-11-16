const PuestosService = require('./puestos.service')

module.exports = function (router) {
    const puestosService = PuestosService();

    router.route('/puesto')
        .post(puestosService.setPuesto);


    router.route('/puesto')
        .get(puestosService.getPuesto);

}