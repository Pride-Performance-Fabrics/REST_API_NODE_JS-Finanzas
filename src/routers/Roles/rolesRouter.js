const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
// const crypterService = require("../../services/crypto");
// const jwk = require("jsonwebtoken");
// const querys = require("../../services/querys");


// *** Obtener la lista de todos los Roles ***
router.get("/", async (req, res) => {
    querys.executeQuery(
        `SELECT * FROM Finanzas.dbo.Roles`,
        req,
        res
    );
    // console.log(res)
})




module.exports = router;