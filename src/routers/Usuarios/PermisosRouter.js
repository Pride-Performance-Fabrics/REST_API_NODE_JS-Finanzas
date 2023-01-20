const express = require('express');
const router = express.Router();
const jwk = require('jsonwebtoken')
const querys = require("../../services/querys");

router.get('/:idUser', async(req, res) => {
 console.log(`entro aqui en get`)
            const resp = await querys.executeQuery(`SELECT idUser, ISNULL(PermisosWeb, '') AS PermisosWeb from Finanzas.dbo.Users WHERE idUser = '${req.params.idUser}'`, req);
            console.log( { permisos: resp.data[0].PermisosWeb } )
            if( resp.data[0].PermisosWeb.length > 0 ){
                const numMenus = await querys.executeQuery(`SELECT MAX(IdContenedor) as numMenus FROM Finanzas.dbo.MenuWeb`, req);
                // console.log(resp)
                const menu = await querys.executeQuery(`SELECT * FROM Finanzas.dbo.MenuWeb WHERE IdMenu IN (${resp.data.length > 0 ?  resp.data[0].PermisosWeb : ''})`, req);
                if(menu.data?.length > 0 && numMenus.data?.length > 0){
                    // console.log('enviado')
                    res.send({
                        data: {
                            menu: menu.data,
                            numMenus: numMenus.data[0].numMenus,
                            permisos: resp.data[0].PermisosWeb
                        },
                        token: menu.token
                    })
                    res.end();
                }else{
                    res.send({
                        data: {
                            menu: [],
                            numMenus: 0,
                            permisos: ''
                        },
                        token: menu.token
                    })
                        
                    res.end();
                    console.log('no enviado', menu, numMenus)
                }
            }else{
                res.send({
                    data: {
                        menu: [],
                        numMenus: 0,
                        permisos: ''
                    },
                    token: resp.token
                })
                res.end();
            }
});

// CAMBIAR LOS PERMISOS DE UN USUARIO
router.put("/cambiarPermisos", async (req, res) => {
    // console.log(req.body)
            const resp = await querys.executeQuery(`UPDATE Finanzas.dbo.Users SET PermisosWeb = '${req.body.permisos}' WHERE idUser = ${req.body.idUser}`, req);
            querys.executeQuery(`SELECT idUser, PermisosWeb from Finanzas.dbo.Users WHERE idUser = ${req.body.idUser}`, req, res);
});


// GET PERMISOS
router.get("/getPermisos/:idUser", async (req, res) => {
    querys.executeQuery(`SELECT idUser, PermisosWeb from Finanzas.dbo.Users WHERE idUser = ${req.params.idUser}`, req, res);
});


module.exports = router;