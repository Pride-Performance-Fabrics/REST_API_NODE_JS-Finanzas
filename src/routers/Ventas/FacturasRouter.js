const express = require('express');
const router = express.Router();
const querys = require('../../services/querys');


router.get('/', async(req, res) =>{
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_InvoicesFinanzas] ORDER BY NumberInvoice ASC`, req, res)
});

router.get('/InvoicesDetails/:idFactura', async(req,res) =>{
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_InvoiceDetailsFinanzas] WHERE IdInvoice= ${req.params.idFactura}  ORDER BY IdInvoiceDetails ASC`, req, res)
});


router.get('/InvoicesCustomer/:IdCustomer', async(req,res) =>{
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_InvoicesFinanzas] WHERE IdCustomer = ${req.params.IdCustomer}ORDER BY IdInvoice ASC`, req, res)
})



module.exports = router;