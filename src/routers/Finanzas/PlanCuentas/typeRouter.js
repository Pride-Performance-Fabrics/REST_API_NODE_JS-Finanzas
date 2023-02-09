const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.acc.AccountType order by IdType ASC`, req, res);
});

router.post("/", async(req, res) =>{
    querys.executeQuery(
        `INSERT INTO Finanzas.dbo.AccountType (
                              CodigoType, 
                              Type,
                              Description,
                              IdClase
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

router.put("/", async(req, res) =>{
    querys.executeQuery(
        `UPDATE Finanzas.acc.AccountType SET 
                              CodigoType = ${req.body.CodigoType},
                              Type = '${req.body.Type}', 
                              Description = '${req.body.Description}',
                              Clase = ${req.body,IdClase}
            WHERE IdType = ${req.body.IdType} `,
        req,
        res
      );
})








module.exports = router;