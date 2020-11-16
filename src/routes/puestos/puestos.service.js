
const { json } = require('body-parser')
const store = require('../../../store')

function PuestosService() {

    async function setPuesto(req, res, next) {
        const {Id} = req.body
        store.RefreshPuesto(Id)
        res.json({message: 'ok'})
    }

    async function getPuesto(req, res, next) {
        const puesto = await store.GetPuesto()
        res.json(puesto)
    }

    return {
        setPuesto,
        getPuesto,

    }
}

module.exports = PuestosService;