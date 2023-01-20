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
});

// *** Obtiene un rol en especifico en funcion de su id ***

router.get('/id/:IdRol', async(req, res) => {
    // console.log("jbhvgv")
    querys.executeQuery(`SELECT [IdRol], [Rol], ISNULL([Description], '') FROM Finanzas.dbo.Roles WHERE IdRol = ${req.params.IdRol}`, req, res);
});

// *** Modifica la informacion de un rol en especifico ***
router.put('/id/:IdRol', async(req, res) => {
    querys.executeQuery(`UPDATE Finanzas.dbo.Roles 
                                    SET Rol = '${req.body.Rol}', 
                                    Description = '${req.body.Description}'
                                Where IdRol = ${req.body.IdRol}`,
        req, res);
});

// *** // Agregar un nuevo rol de usuario ***
router.post('/', async(req, res) => {
   

    querys.executeQuery(`INSERT INTO Finanzas.dbo.Roles (Rol, Description) VALUES ('${req.body.Rol}', '${req.body.Description}')`, req, res);
});





module.exports = router;