const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.AccountType order by Id ASC`, req, res);
});

router.post("/", async(req, res) =>{
    querys.executeQuery(
        `INSERT INTO Finanzas.dbo.AccountType (
                              IdType,
                              Type, 
                              Description
                              ) VALUES (
                              ${req.body.IdType},
                              '${req.body.Type}', 
                              '${req.body.Description}'
        ) SELECT TOP(1) * FROM Finanzas.dbo.AccountType ORDER BY IdType DESC`,
        req,
        res
      );
})

router.put("/", async(req, res) =>{
    querys.executeQuery(
        `UPDATE dbo.AccountType SET 
                              IdType = ${req.body.IdType},
                              Type = '${req.body.Type}', 
                              Description = '${req.body.Description}'
                              WHERE Id = ${req.body.Id} `,
        req,
        res
      );
})


// router.get("/", async (req, res) => {
//     const types = await querys.executeProcedureWithOutRes(`SELECT * FROM Finanzas.dbo.AccountType order by IdType ASC`, req);
//     if (types.lenght > 0) {
//         const result = types.map(async (types) => {
//             const subType = await querys.executeProcedureWithOutRes(`SELECT * FROM Finanzas.dbo.AccountSubType order by IdSubType ASC`, req);
//             console.log(subType)
//         })
//     }
//     res.end()
// });






module.exports = router;