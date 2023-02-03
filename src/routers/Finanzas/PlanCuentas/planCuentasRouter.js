const express = require("express");
const router = express.Router();
const data = require("../../../database/conection");
const querys = require("../../../services/querys");
const crypterService = require("../../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    console.log("entro aqui")
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.vta_CharAccount order by Id ASC`, req, res);
});

router.get("/accounts", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.CharAccount order by IdAccount ASC`, req, res);
});


// router.post("/", async(req, res) =>{
//     querys.executeQuery(
//         `INSERT INTO Finanzas.dbo.CharAccount (
//                               IdAccount,
//                               Account, 
//                               Currency,
//                               Description, 
//                               ActiveStatus, 
//                               SubType, 
//                               IdContenedorAccount, 
//                               IdUser,
//                               Fecha,
//                               Saldo
//                               ) VALUES (
//                               ${req.body.IdAccount},
//                               '${req.body.Account}', 
//                               ${req.body.Currency},
//                               '${req.body.Description}', 
//                               ${req.body.ActiveStatus}, 
//                               ${req.body.SubType}, 
//                               ${req.body.idContenedorAccount}, 
//                               ${req.body.idUser},
//                               '${req.body.Fecha}',
//                               ${req.body.Saldo}

//                               ) SELECT TOP(1) * FROM Finanzas.dbo.CharAccount ORDER BY IdAccount DESC`,
//         req,
//         res
//       );
// })


router.post("/", async(req, res) =>{
    const inputs = [
        {
            key: "id",
            value: req.body.id
        },
        {
            key: "IdAccount",
            value: req.body.IdAccount
        },
        {
            key: "Account",
            value: req.body.Account
        },
        {
            key: "Currency",
            value: req.body.Currency
        },
        {
            key: "Description",
            value: req.body.Description
        },
        {
            key: "ActiveStatus",
            value: req.body.ActiveStatus
        },
        {
            key: "SubType",
            value: req.body.SubType
        },
        {
            key: "IdContenedorAccount",
            value: req.body.IdContenedorAccount
        },
        {
            key: "IdUser",
            value: req.body.idUser
        },
        {
            key: "Fecha",
            value: req.body.Fecha
        },
        {
            key: "Saldo",
            value: req.body.Saldo
        }

    ]
    querys.executeProcedure(`FINANZAS.[web].[IUCharAccount]`, req, res, inputs);
})



module.exports = router;