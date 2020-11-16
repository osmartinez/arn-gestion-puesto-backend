const fs = require('fs');
const PuestoWS = require('./src/lib/repository/puesto.ws')()
let puesto = {}

module.exports = {

    async GetPuesto() {
        if (puesto.Id) {
            return puesto
        }
        else {
            var settings =require('./settings.json')
            puesto = await PuestoWS.obtenerPorId(settings.IdPuesto)
            puesto.Maquinas = await PuestoWS.obtenerMaquinas(settings.IdPuesto)
            puesto.Incidencias = await PuestoWS.obtenerConfiguracionesIncidencias(settings.IdPuesto)
            puesto.Pins = await PuestoWS.obtenerConfiguracionesPins(settings.IdPuesto)
            return puesto
        }
    },

    RefreshPuesto(id) {
        var settings =require('./settings.json')
        settings.IdPuesto = id
        fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
            if (err) console.error(err);
        });
        puesto = {}
    },
}