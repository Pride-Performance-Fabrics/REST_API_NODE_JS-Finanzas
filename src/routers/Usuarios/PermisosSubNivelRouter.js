const express = require("express");
const router = express.Router();
const querys = require("../../services/querys");

// REQUEST PARA GENERAR LOS CHECKBOX
router.get("/", async (req, res) => {
  querys.executeProcedure(`Finanzas.web.ObtenerSubNiveles`, req, res);
});

// REQUEST PARA OBTENER LOS NIVELES DEL MENU AL QUE TIENE ACCESO UN USUARIO
router.get("/:IdUsuario", async (req, res) => {
  querys.executeQuery(
    `SELECT * FROM Finanzas.dbo.PermisosSubNivelWeb WHERE IdUsuario = ${req.params.IdUsuario}`,
    req,
    res
  );
});
// REQUEST PARA OBTENER LOS NIVELES DEL MENU AL QUE TIENE ACCESO ACTIVO UN USUARIO
router.get("/activos/:IdUsuario", async (req, res) => {
  const inputs = [
    {
      key: "idUsuario",
      value: req.params.IdUsuario,
    },
  ];
  querys.executeProcedure(`Finanzas.dbo.PermisosUserSubMenu`, req, res, inputs);
});

// REQUEST PARA AGREGAR UN NIVEL DE ACCESO QUE TIENE UN ROL EN EL MENU
router.post("/", async (req, res) => {
  querys.executeQuery(
    `INSERT INTO Finanzas.dbo.PermisosSubNivelWeb (IdUsuario, IdSubNivel, Acceso) VALUES ('${req.body.IdUsuario}', '${req.body.IdSubNivel}', '${req.body.Acceso}')`,
    req,
    res
  );
});

// REQUEST PARA MODIFICAR UN NIVEL DE ACCESO QUE TIENE UN ROL EN EL MENU
router.put("/", async (req, res) => {
  querys.executeQuery(
    `UPDATE Finanzas.dbo.PermisosSubNivelWeb]
                            SET [Acceso] = ${req.body.Acceso}
                        WHERE IdPermiso = ${req.body.IdPermiso}`,
    req,
    res
  );
});

// REQUEST PARA MODIFICAR UN NIVEL DE ACCESO QUE TIENE UN ROL EN EL MENU
router.post("/modificarPermisoUser", async (req, res) => {
    const inputs = [
        {
            key: 'IdUsuario',
            value: req.body.IdUsuario
        },
        {
            key: 'IdSubNivel',
            value: req.body.IdSubNivel
        },
        {
            key: 'Acceso',
            value: req.body.Acceso
        },
    ]
    querys.executeProcedure(`ips.web.CambiarPermisoSubmenu`, req, res, inputs);
});

module.exports = router;