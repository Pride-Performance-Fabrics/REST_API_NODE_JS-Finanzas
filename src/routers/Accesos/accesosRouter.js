const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
const crypterService = require("../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');


router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM Finanzas.[dbo].[vta_Accesos] order by IdAcceso ASC`, req, res);
});

router.post("/", async (req, res) => {
    const inputs = [
        {
            key: "IdAcceso",
            value: req.body.IdAcceso
        },
        {
            key: "Acceso",
            value: req.body.Acceso
        },
        {
            key: "ActivoWeb",
            value: req.body.ActivoWeb
        },
        {
            key: "IdMenu",
            value: req.body.IdMenu
        }
    ]
    querys.executeProcedure(`FINANZAS.web.IUAccesos`, req, res, inputs);
});


router.get("/AccessGroup", async (req, res) => {
    console.log("entro aqui")
    const ag = await querys.executeQuery(`SELECT * FROM Finanzas.[dbo].[vta_Accesos] order by IdAcceso ASC`, req);

    if (ag.data.length > 0) {
        let modulos = []
        ag.data.forEach(modulo => {
            if (modulos.findIndex(i => i.IdMenuMenu === modulo.IdMenu) < 0) {
                modulos.push({
                    IdMenuMenu: modulo.IdMenu,
                    Menu: modulo.Menu,
                    URL: modulo.URL,
                    Icon: modulo.Icon,
                    Accesos: ag.data.filter(i => i.IdMenu === modulo.IdMenu).map(i => {
                        return {
                            IdAcceso: i.IdAcceso,
                            Acceso: i.Acceso,
                            ActivoWeb: i.ActivoWeb,
                            Menu: i.IdMenu
                        }
                    })
                })
            }
        });
        res.send({ data: modulos, token: req.headers['x-access-token'] })
    }


    res.end()
})

// //******************** OBTENER LOS ACCESOS DE UN USUARIO ****/
router.get('/:idUser', async (req, res) => {
    console.log(`entro aqui en get`)
    const resp = await querys.executeQuery(`SELECT idUser, ISNULL(Accesos, '') AS Accesos from Finanzas.dbo.Users WHERE idUser = '${req.params.idUser}'`, req);
    console.log({ accesos: resp.data[0].Accesos })
    if (resp.data[0].Accesos.length > 0) {
        const numAccesos = await querys.executeQuery(`SELECT MAX(IdAcceso) as numAccesos FROM Finanzas.dbo.Accesos`, req);
        // console.log(resp)
        const acceso = await querys.executeQuery(`SELECT * FROM Finanzas.dbo.Accesos WHERE IdAcceso IN (${resp.data.length > 0 ? resp.data[0].Accesos : ''})`, req);
        if (acceso.data?.length > 0 && numAccesos.data?.length > 0) {
            // console.log('enviado')
            res.send({
                data: {
                    acceso: acceso.data,
                    numAccesos: numAccesos.data[0].numAccesos,
                    accesos: resp.data[0].Accesos
                },
                token: acceso.token
            })
            res.end();
        } else {
            res.send({
                data: {
                    acceso: [],
                    numAccesos: 0,
                    accesos: ''
                },
                token: acceso.token
            })

            res.end();
            console.log('no enviado', acceso, numAccesos)
        }
    } else {
        res.send({
            data: {
                acceso: [],
                numAccesos: 0,
                accesos: ''
            },
            token: resp.token
        })
        res.end();
    }
});


// //******************** OBTENER LOS ACCESOS DE LOS ROLES****/
router.get('/roles/:IdRol', async (req, res) => {
    // console.log(req.body.IdRol)
    const resp = await querys.executeQuery(`SELECT IdRol, ISNULL(Accesos, '') AS Accesos from Finanzas.dbo.Roles WHERE IdRol = '${req.params.IdRol}'`, req);
    console.log({ accesos: resp.data[0].Accesos })
    if (resp.data[0].Accesos.length > 0) {
        const numAccesos = await querys.executeQuery(`SELECT MAX(IdAcceso) as numAccesos FROM Finanzas.dbo.Accesos`, req);
        // console.log(resp)
        const acceso = await querys.executeQuery(`SELECT * FROM Finanzas.dbo.Accesos WHERE IdAcceso IN (${resp.data.length > 0 ? resp.data[0].Accesos : ''})`, req);
        if (acceso.data?.length > 0 && numAccesos.data?.length > 0) {
            // console.log('enviado')
            res.send({
                data: {
                    acceso: acceso.data,
                    numAccesos: numAccesos.data[0].numAccesos,
                    accesos: resp.data[0].Accesos
                },
                token: acceso.token
            })
            res.end();
        } else {
            res.send({
                data: {
                    acceso: [],
                    numAccesos: 0,
                    accesos: ''
                },
                token: acceso.token
            })

            res.end();
            console.log('no enviado', acceso, numAccesos)
        }
    } else {
        res.send({
            data: {
                acceso: [],
                numAccesos: 0,
                accesos: ''
            },
            token: resp.token
        })
        res.end();
    }
});

// //******************** CAMBIAR LOS ACCESOS DE UN USUARIO ****/

router.put("/cambiarAccesos", async (req, res) => {
    console.log(req.body)
    const resp = await querys.executeQuery(`UPDATE Finanzas.dbo.Users SET Accesos = '${req.body.accesos}' WHERE idUser = ${req.body.idUser}`, req);
    querys.executeQuery(`SELECT idUser, Accesos from Finanzas.dbo.Users WHERE idUser = ${req.body.idUser}`, req, res);
});


// //******************** CAMBIAR LOS ACCESOS DE LOS ROLES ****/

router.put("/cambiarAccesosRoles", async (req, res) => {
    console.log(req.body)
    const resp = await querys.executeQuery(`UPDATE Finanzas.dbo.Roles SET Accesos = '${req.body.accesos}' WHERE IdRol = ${req.body.IdRol}`, req);
    querys.executeQuery(`SELECT IdRol, Accesos from Finanzas.dbo.Roles WHERE IdRol = ${req.body.IdRol}`, req, res);
});






module.exports = router;


