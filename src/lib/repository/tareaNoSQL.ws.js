const genericWebservice = require('./generic.ws')()
const wsName = 'tareaNoSQL'

function TareaNoSQLWebservice() {
    async function sumarPares(idPuesto, pares) {
        const resp = await genericWebservice.post({
            idPuesto: idPuesto,
            pares: pares
        }, wsName, 'sumarPares')
        const msg = await resp.json()
        return msg
    }

    return {
        sumarPares,

    }
}

module.exports = TareaNoSQLWebservice()