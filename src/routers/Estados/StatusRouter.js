const express = require('express');
const router = express.Router();
const querys = require('../../services/querys');


// OBTIENE LOS ESTADOS SECURITY DE LOS USUARIOS
router.get('/Security', async(req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.Status WHERE StatusCategory = 'Security' ORDER BY StatusName`, req, res);
});

router.put('/finanzas', async(req,res) =>{
    inputs = [
        {
            key: 'id',
            value: req.body.id
        },
        {
            key: 'ActiveStatus',
            value: req.body.ActiveStatus
        },
    ]
    querys.executeProcedure(`[web].[CambiarEstadoCuenta]`, req, res, inputs);

})




module.exports = router;