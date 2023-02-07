const express = require('express');
const router = express.Router();
const querys = require("../../services/querys");

router.get('/:IdRol/:idUser', async(req, res) => {
    const inputs = [{
            key: 'IdRol',
            value: req.params.IdRol
        },
        {
            key: 'idUser',
            value: req.params.idUser
        },
    ]
    querys.executeProcedure('Finanzas.web.obtenerMenu', req, res, inputs);
});



// REQUEST PARA MOSTRAR LOS MENUS (NIVELES)
router.get('/Nivel', async(req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.NivelMenuWeb`, req, res);
});


// REQUEST PARA MOSTRAR LOS MENUS (NIVELES)
router.get('/permisosUsuario', async(req, res) => {
    querys.executeProcedure('Finanzas.dbo.PermisosSubNivelUsuario', req, res);
});

// MODIFICAR LA INFORMACION DE UN MENU EN ESPECIFICO  
router.put('/IdNivel', async(req, res) => {
    querys.executeQuery(`UPDATE web.NivelMenuWeb 
                                SET Nivel = '${req.body.Nivel}', 
                                Icon = '${req.body.Icon}',
                                URL = '${req.body.URL}'
                            Where IdNivelWeb = '${req.body.IdNivelWeb}'`,
        req, res);
});


// REQUEST PARA MOSTRAR LOS SUBMENUS (SUBNIVELES)
router.get('/SubNivel', async(req, res) => {
    querys.executeQuery(`SELECT Nivel.IdNivelWeb, Nivel.Nivel, SubNivel.IdSubNivel, SubNivel.SubNivel, SubNivel.Icon, SubNivel.URL 
                        from WEB.NivelMenuWeb as Nivel Left join 
                        WEB.SubNivelMenuWeb as SubNivel ON Nivel.IdNivelWeb = SubNivel.IdNivel`,
        req, res);
});


// MODIFICAR LA INFORMACION DE UN MENU EN ESPECIFICO
router.put('/IdSubNivel', async(req, res) => {
    querys.executeQuery(`UPDATE dbo.SubNivelMenuWeb 
                            SET SubNivel = '${req.body.SubNivel}', 
                            Icon = '${req.body.Icon}',
                            URL = '${req.body.URL}'
                        Where IdSubNivel = '${req.body.IdSubNivel}'`,
        req, res);

});

router.post('/all', async (req,res) => {
    const query = `SELECT * FROM Finanzas.dbo.MenuWeb WHERE IdMenu IN (${req.body.Permisos})`
    querys.executeQuery(query, req, res);
})

// OBTENER TODOS LOS MENUS  
router.get('/', async(req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.dbo.Vta_MenuWeb`, req, res);
});

router.post("/IUMenu", async (req, res) => {
    const inputs = [
        {
            key: "IdMenu",
            value: req.body.IdMenu
        },
        {
            key: "Menu",
            value: req.body.Menu
        },
        {
            key: "Icon",
            value: req.body.Icon
        },
        {
            key: "IconApp",
            value: req.body.IconApp
        },
        {
            key: "URL",
            value: req.body.URL
        },
        {
            key: "MenuWeb",
            value: req.body.MenuWeb
        },
        {
            key: "IdContenedor",
            value: req.body.IdContenedor
        },
        {
            key: "Orden",
            value: req.body.Orden
        },
        {
            key: "ActivoAPP",
            value: req.body.ActivoAPP
        },
       
    ]
    querys.executeProcedure(`FINANZAS.web.IUMenu`, req, res, inputs);
});


// //******************** ACTUALIZAR EL ESTADO DE LA ACTIVIDAD DEL MENU ****/

router.put("/actividadMenu", async (req, res) => {
    if (req.body.Menu === 1) {
        const resp = await querys.executeQuery(`UPDATE Finanzas.dbo.MenuWeb SET MenuWeb = '${req.body.Activo}' WHERE IdMenu = ${req.body.IdMenu}`, req);
        querys.executeQuery(`SELECT * FROM Finanzas.dbo.Vta_MenuWeb order by IdMenu ASC`, req, res);
    }
    else {
        const resp = await querys.executeQuery(`UPDATE Finanzas.dbo.MenuWeb SET ActivoAPP = '${req.body.Activo}' WHERE IdMenu = ${req.body.IdMenu}`, req);
        querys.executeQuery(`SELECT * FROM Finanzas.dbo.Vta_MenuWeb order by IdMenu ASC`, req, res);
    }

});


module.exports = router;