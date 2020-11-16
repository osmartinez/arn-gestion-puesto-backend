const express = require('express'); 

function eRoutes() {
    const router = express.Router();
    
    require('./pins/pins.routes')(router);
    require('./puestos/puestos.routes')(router);

    return router;
}

module.exports = eRoutes;