const express = require("express");
const router = express.Router();
const querys = require("../../services/querys");


// *** REQUEST PARA GENERAR LOS CHECKBOX ***
router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.NivelMenuWeb`, req, res);
});


// *** REQUEST PARA OBTENER LOS NIVELES DEL MENU AL QUE TIENE ACCESO UN ROL ***
router.get("/:IdRol", async (req, res) => {
    querys.executeQuery(
        `SELECT * FROM Finanzas.dbo.PermisosNivelMenuWeb WHERE IdRol = ${req.params.IdRol}`,
        req,
        res
    );
});

// *** REQUEST PARA AGREGAR UN NIVEL DE ACCESO QUE TIENE UN ROL EN EL MENU ***
router.post("/", async (req, res) => {
    querys.executeQuery(
      `INSERT INTO Finanzas.dbo.PermisosNivelMenuWeb (IdRol, IdNivelMenuWeb, Acceso) VALUES ('${req.body.IdRol}', '${req.body.IdNivelMenuWeb}', '${req.body.Acceso})'`,
      req,
      res
    );
  });
  
// *** REQUEST PARA MODIFICAR UN NIVEL DE ACCESO QUE TIENE UN ROL EN EL MENU ***

router.put("/", async (req, res) => {
    querys.executeQuery(
        `UPDATE Finanzas.dbo.PermisosNivelMenuWeb
                              SET [Acceso] = ${req.body.Acceso}
                          WHERE IdPermiso = ${req.body.IdPermiso}`,
        req,
        res
    );
});


// //******************** REQUEST PARA MODIFICAR UN NIVEL DE ACCESO QUE TIENE UN ROL EN EL MENU ****/
router.post("/modificarPermisoRol", async (req, res) => {
    const inputs = [
        {
            key: 'IdRol',
            value: req.body.IdRol
        },
        {
            key: 'IdNivelMenuWeb',
            value: req.body.IdNivelMenuWeb
        },
        {
            key: 'Acceso',
            value: req.body.Acceso
        },
    ]
    querys.executeProcedure(`Finanzas.web.CambiarPermisoRol`, req, res, inputs);
});

module.exports = router;