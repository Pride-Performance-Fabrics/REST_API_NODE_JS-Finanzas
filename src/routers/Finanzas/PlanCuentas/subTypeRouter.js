const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.AccountSubType order by IdSubType ASC`, req, res);
});

router.get("/ultimaCuenta/:Id/:IdSubType", async (req, res) => {
    const inputs = [
        {
            key: "Id",
            value: req.params.Id
        },
        {
            key: "IdSubType",
            value: req.params.IdSubType
        }
    ]
    querys.executeProcedure(`FINANZAS.[web].[ObtenerUltimaCuentaSubTipo]`, req, res, inputs);
});


router.get("/tipos", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.vta_AccountSubType order by IdSubType ASC`, req, res);
});


router.post("/", async(req, res) =>{
    console.log(req.body)
    querys.executeQuery(
        `INSERT INTO Finanzas.dbo.AccountSubType(
                              IdSubType,
                              SubType, 
                              Description,
                              IdType
                              ) VALUES (
                              ${req.body.IdSubType},
                              '${req.body.SubType}', 
                              '${req.body.Description}',
                              ${req.body.IdType}
        ) SELECT TOP(1) * FROM Finanzas.dbo.AccountSubType ORDER BY IdSubType DESC`,
        req,
        res
      );
})

router.put('/', async(req,res) =>{
    querys.executeQuery(
        `INSERT INTO Finanzas.dbo.AccountSubType(
                              IdSubType,
                              SubType, 
                              Description,
                              IdType
                              ) VALUES (
                              ${req.body.IdSubType},
                              '${req.body.SubType}', 
                              '${req.body.Description}',
                              ${req.body.IdType}
        ) SELECT TOP(1) * FROM Finanzas.dbo.AccountSubType ORDER BY IdSubType DESC`,
        req,
        res
      );
})






module.exports = router;