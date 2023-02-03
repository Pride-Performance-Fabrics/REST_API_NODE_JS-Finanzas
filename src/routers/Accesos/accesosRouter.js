const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
const crypterService = require("../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.[dbo].[vta_Accesos] order by IdAcceso ASC`, req, res);
});

router.post("/", async (req, res) => {
    const inputs = [
        {
            key: "IdAcceso",
            value: req.body.IdAcceso
        },
        {
            key: "Acceso",
            value: req.body.Acceso
        },
        {
            key: "ActivoWeb",
            value: req.body.ActivoWeb
        },
        {
            key: "IdMenu",
            value: req.body.IdMenu
        }
    ]
    querys.executeProcedure(`FINANZAS.web.IUAccesos`, req, res, inputs);
});

module.exports = router;