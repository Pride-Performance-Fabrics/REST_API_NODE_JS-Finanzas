const express = require('express');
const router = express.Router();
const querys = require('../../services/querys');

router.get('/', async(req, res) => {
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_Finanzas-Customer]`, req, res);
});


router.get('/customerDetails', async(req, res) => {
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_CustomerDetails]`, req, res);
});

router.get('/customerDetails/:IdCustomer', async(req, res) =>{
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_CustomerDetails]
	WHERE [vta_CustomerDetails].IdCustomer = ${req.params.IdCustomer}`, req, res)
})


router.get('/customerUltimoIdCustomer', async(req, res) =>{
    querys.executeQuery(`SELECT TOP(1) IdCustomer, CustomerName
    FROM Finanzas.dbo.Customer ORDER BY IdCustomer DESC`, req, res);
});

router.post('/IUCustomer', async(req,res) =>{
    console.log("-----------------------CLIENTES--------------------------")
    console.log(req.body)
    console.log("-----------------------CLIENTES--------------------------")
    const inputs = [
        {
            key: "IdCustomer",
            value: req.body.IdCustomer
        },
        {
            key: "IdStatus",
            value: req.body.IdStatus
        },
        {
            key: "RTN",
            value: req.body.RTN
        },
        {
            key: "CodigoCliente",
            value: req.body.CodigoCliente
        },
        {
            key: "Abreviacion",
            value: req.body.Abreviacion
        },
        {
            key: "CustomerName",
            value: req.body.CustomerName
        },
        {
            key: "Address",
            value: req.body.Address
        },
        {
            key: "City",
            value: req.body.City
        },
        {
            key: "State",
            value: req.body.State
        },
        {
            key: "Country",
            value: req.body.Country
        },
        {
            key: "ZipCode",
            value: req.body.ZipCode
        },
        {
            key: "Tel",
            value: req.body.Tel
        },
        {
            key: "Email",
            value: req.body.Email
        },
        {
            key: "Contact",
            value: req.body.Contact
        },
        {
            key: "Tel2",
            value: req.body.Tel2
        },
        {
            key: "Email2",
            value: req.body.Email2
        },
        {
            key: "Contact2",
            value: req.body.Contact2
        },
        {
            key: "TipoPago",
            value: req.body.TipoPago
        },
        {
            key: "IdOrderUnits",
            value: req.body.IdOrderUnits
        },
        {
            key: "CreditLimit",
            value: req.body.CreditLimit
        },
        {
            key: "IdTerms",
            value: req.body.IdTerms
        },
        {
            key: "IdFreightTerms",
            value: req.body.IdFreightTerms
        },
        {
            key: "IdShipper",
            value: req.body.IdShipper
        },
        {
            key: "IsShipTo",
            value: req.body.IsShipTo
        },
        {
            key: "IsBillTo",
            value: req.body.IsBillTo
        },
        {
            key: "DateCreate",
            value: req.body.DateCreate
        },
        {
            key: "Comments",
            value: req.body.Comments
        },
        {
            key: "Porcentaje",
            value: req.body.Porcentaje
        },
        {
            key: "BlockFinanzas",
            value: req.body.BlockFinanzas
        },
        {
            key: "SalesEmail",
            value: req.body.SalesEmail
        },
        {
            key: "IdUserEditWeb",
            value: req.body.IdUserEditWeb
        },
        

    ]
    querys.executeProcedure(`FINANZAS.[web].[IUCustomer]`, req, res, inputs);
});



//************************** CUSTOMER DETAILS */
router.get('/customerDetailsUltimoId', async(req, res) =>{
    querys.executeQuery(`SELECT TOP(1) IdDCustomer, CompanyName
    FROM [Finanzas].[dbo].[CustomerDetails] ORDER BY IdDCustomer DESC`, req, res);
});

router.post('/IUCustomerDetails', async(req,res) =>{
    console.log("-----------------------CLIENTES Detalle--------------------------")
    console.log(req.body)
    console.log("-----------------------CLIENTES Detalle--------------------------")
    const inputs = [
        {
            key: "IdDCustomer",
            value: req.body.IdDCustomer
        },
        {
            key: "IdCustomer",
            value: req.body.IdCustomer
        },
        {
            key: "IdStatus",
            value: req.body.IdStatus
        },
        {
            key: "DateCreate",
            value: req.body.DateCreate
        },
        {
            key: "RTN",
            value: req.body.RTN
        },
 
        {
            key: "CompanyName",
            value: req.body.CompanyName
        },
        {
            key: "Address",
            value: req.body.Address
        },
        {
            key: "Contact",
            value: req.body.Contact
        },
        {
            key: "City",
            value: req.body.City
        },
        {
            key: "State",
            value: req.body.State
        },
        {
            key: "Country",
            value: req.body.Country
        },
        {
            key: "ZipCode",
            value: req.body.ZipCode
        },
        {
            key: "Tel",
            value: req.body.Tel
        },
        {
            key: "Email",
            value: req.body.Email
        },
        {
            key: "IsShipTo",
            value: req.body.IsShipTo
        },
        {
            key: "IsBillTo",
            value: req.body.IsBillTo
        },
        {
            key: "IsBuyer",
            value: req.body.IsBuyer
        },
        {
            key: "IdUserEditWeb",
            value: req.body.IdUserEditWeb
        },
      
 

    ]
    querys.executeProcedure(`[Finanzas].[web].[IUCustomerDetails]`, req, res, inputs);
});







module.exports = router;