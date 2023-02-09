const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.acc.vta_SubCategories order by IdSubCategoria ASC`, req, res);
});




router.post("/", async (req, res) => {
    const inputs = [
        {
            key: "IdSubCategoria",
            value: req.body.IdSubCategoria
        },
        {
            key: "CodigoSubCategoria",
            value: req.body.CodigoSubCategoria
        },
        {
            key: "IdCategoria",
            value: req.body.IdCategoria
        },
        {
            key: "SubCategoria",
            value: req.body.SubCategoria
        },
        {
            key: "Description",
            value: req.body.Description
        }

    ]
    querys.executeProcedure(`Finanzas.[web].[IUAccountSubCategorias]`, req, res, inputs);
});


module.exports = router;