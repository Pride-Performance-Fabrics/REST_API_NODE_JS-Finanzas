const express = require("express");
const router = express.Router();
const querys = require("../../services/querys");
const data = require('../../database/conection');
const crypterService = require('../../services/crypto');

// OBTENER EL REGISTRO DE SESSIONES DE USUARIOS
router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.vta_Sessiones order by IdSession desc`, req, res);
});

// CAMBIA LA FECHA DE VENCIMIENTO EN CASO DE CIERRE DE SESSION VOLUNTARIA
router.put("/:idUser", async (req, res) => {
console.log("entro aqui token")
  const query = `UPDATE Finanzas.dbo.[Sessions]
  SET [Vencimiento] = GETDATE()
WHERE idUser = ${req.params.idUser}
and vencimiento > GETDATE()`;

  try {
    const tokenInfo = crypterService.verifyJWK(req);
    if (tokenInfo.auth) {
        const pool = await data.connectToDatabase();
        const result = await pool.request().query(query)
        .then(result => {
                res.status(200).send({ data: result.recordset });
                res.end();
            })
            .catch(error => {
                console.error({error})
                res.send({ 'error': error });
                res.end();
            });
        } else {
        console.error({auth: false})
        res.send({
            auth: false
        })
        res.end()
    }
} catch (error) {
    console.error({error});
    res.send({
        auth: false,
        error: error
    })
    res.end()
}
});

module.exports = router;
