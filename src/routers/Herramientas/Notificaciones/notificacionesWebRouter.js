const express = require('express');
const { enviarNotificacion } = require("../../../services/firebase/Notificaciones");
const querys = require('../../../services/querys');
const crypterService = require("../../../services/crypto");

const router = express.Router();

router.post('/', (req, res) => {
    enviarNotificacion(req);
    res.send({data: { mensaje: 'Notificacion enviada', valid: true }, valid: true});
    res.end();
});

module.exports = router;