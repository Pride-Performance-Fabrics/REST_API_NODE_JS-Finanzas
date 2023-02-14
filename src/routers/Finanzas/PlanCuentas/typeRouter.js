const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');

//***************************** OBTIENE LOS TIPOS DE CUENTAS  ***********************************//

router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.acc.vta_Types order by IdType ASC`, req, res);
});

//***************************** INSERTA NUEVO TIPOS DE CUENTAS  ***********************************//

router.post("/", async(req, res) =>{
    querys.executeQuery(
        `INSERT INTO Finanzas.acc.AccountType (
                              CodigoType, 
                              Type,
                              Description,
                              Clase
                              ) VALUES (
                              ${req.body.CodigoType},
                              '${req.body.Type}', 
                              '${req.body.Description}',
                              ${req.body.IdClase}

        ) SELECT TOP(1) * FROM Finanzas.acc.AccountType ORDER BY IdType DESC`,
        req,
        res
      );
})

//***************************** ACTUALIZA LOS TIPOS DE CUENTAS  ***********************************//

router.put("/", async(req, res) =>{
    querys.executeQuery(
        `UPDATE Finanzas.acc.AccountType SET 
                              CodigoType = ${req.body.CodigoType},
                              Type = '${req.body.Type}', 
                              Description = '${req.body.Description}',
                              Clase = ${req.body.IdClase}
            WHERE IdType = ${req.body.IdType} `,
        req,
        res
      );
})


module.exports = router;