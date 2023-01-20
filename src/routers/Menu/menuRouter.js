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


module.exports = router;