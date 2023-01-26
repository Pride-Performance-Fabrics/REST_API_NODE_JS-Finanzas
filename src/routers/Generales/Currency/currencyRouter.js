const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.Currency`, req, res);
});




module.exports = router;