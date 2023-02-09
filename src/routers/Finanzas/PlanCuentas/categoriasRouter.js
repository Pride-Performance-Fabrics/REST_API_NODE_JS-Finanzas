const express = require('express');
const router = express.Router();
const querys = require('../../../services/querys');


router.get('/', async(req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.acc.vta_Categories`, req, res);
});




router.post("/", async (req, res) => {
    const inputs = [
        {
            key: "IdCategoria",
            value: req.body.IdCategoria
        },
        {
            key: "CodigoCategoria",
            value: req.body.CodigoCategoria
        },
        {
            key: "Categoria",
            value: req.body.Categoria
        },
        {
            key: "Description",
            value: req.body.Description
        },
        {
            key: "IdType",
            value: req.body.IdType
        }
    ]
    querys.executeProcedure(`Finanzas.web.IUAccountCategorias`, req, res, inputs);
});



module.exports = router;