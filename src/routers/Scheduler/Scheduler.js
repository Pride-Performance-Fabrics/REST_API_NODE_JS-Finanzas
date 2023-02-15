const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
const crypterService = require("../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');

//***************************** OBTIENE LOS EVENTOS  ***********************************//
router.get("/", async (req, res) => {
    querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[Calendar] where  status = 1 order by IdCalendar`, req, res);
});

//***************************** INSERTA NUEVO EVENTOS  ***********************************//

router.post('/', (req, res) => {
    querys.executeQuery(`
    INSERT INTO [Finanzas].[dbo].[Calendar]
       ([IdUser]
          , [IdRol]
          , [startDate]
          , [endDate]
          , [title]
          , [allDay]
          , [rRule]
        --  , [exDate]
          , [notes]
          , [members]
          ,[createDate]
          ,[status]
          
          )
 VALUES
          (${req.body.IdUser},
             ${req.body.IdRol},
             '${req.body.startDate}',
             '${req.body.endDate}',
             '${req.body.title}',
             ${req.body.allDay ? 1 : 0},
             ${req.body.rRule === null ? null : "'" + req.body.rRule + "'"},
            -- ${req.body.exDate === null ? null : "'" + req.body.exDate + "'"},
             '${req.body.notes}'
             ,${req.body.members === null ? null : "'" + req.body.members + "'"}
             ,'${req.body.createDate}'
             ,${req.body.status}
             )`,
       req, res)
 });

//***************************** ACTUALIZA LOS EVENTOS  ***********************************// 

router.put('/', (req, res) => {
    console.log('Edit',req.body)
    querys.executeQuery(`
    UPDATE [Finanzas].[dbo].[Calendar]
    SET [IdUser] = ${req.body.IdUser}
       ,[IdRol] = ${req.body.IdRol}
       ,[startDate] = '${req.body.startDate}'
       ,[endDate] = '${req.body.endDate}'
       ,[title] = '${req.body.title}'
       ,[allDay] = ${req.body.allDay ? 1 : 0}
       ,[rRule] = ${req.body.rRule === null ? null : "'" + req.body.rRule + "'"}
       --,[exDate] = ${req.body.exDate === null ? null : "'" + req.body.exDate + "'"}
       ,[notes] = '${req.body.notes}'
       ,[members] = ${req.body.members === null ? null : "'" + req.body.members + "'"}
  WHERE IdCalendar = ${req.body.IdCalendar}`
       , req, res)
 });

 //***************************** EDITAR EL ESTADO UNA ACTIVIDAD  ***********************************//
//  router.delete('/:IdCalendar', (req, res) => {
//     console.log('Editar Estado',req.params.IdCalendar)
//     querys.executeQuery(`UPDATE [dbo].[Calendar]
//     SET 
//        [status] = ${0}
//    WHERE IdCalendar = ${req.params.IdCalendar}`, req, res)
//  });

 router.put('/status', (req, res) => {
   // console.log('Editar Estado',req.params.IdCalendar)
   querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
   SET 
      [status] = 0
  WHERE IdCalendar = ${req.body.IdCalendar}`, req, res)
});
 

module.exports = router;