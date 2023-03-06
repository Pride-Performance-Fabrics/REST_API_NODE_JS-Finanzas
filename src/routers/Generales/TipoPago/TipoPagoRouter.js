const express = require('express');
const router = express.Router();
const querys = require('../../../services/querys');

router.get('/', async(req, res) => {
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[TipoPago]`, req, res);
});

module.exports = router;