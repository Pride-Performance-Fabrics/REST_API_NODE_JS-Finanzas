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


router.get("/AccessGroup", async(req, res) =>{
    console.log("entro aqui")
    const ag = await querys.executeQuery(`SELECT * FROM Finanzas.[dbo].[vta_Accesos] order by IdAcceso ASC`, req);

    if(ag.data.length > 0){
        let modulos = []
        ag.data.forEach(modulo => {
            if(modulos.findIndex(i => i.IdMenuMenu === modulo.IdMenu)< 0){
                modulos.push({
                    IdMenuMenu: modulo.IdMenu,
                    Menu: modulo.Menu,
                    URL: modulo.URL,
                    Accesos: ag.data.filter(i => i.IdMenu === modulo.IdMenu).map(i =>{
                        return{
                            IdAcceso: i.IdAcceso,
                            Acceso: i.Acceso,
                            ActivoWeb: i.ActivoWeb,
                            Menu: i.IdMenu
                        }
                    })
                })
            }
        });
        res.send({data: modulos, token: req.headers['x-access-token']})
    }
   

    res.end()
})
module.exports = router;


