const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
const crypterService = require("../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');

const setDateTimeSQL = require("../../services/fechasServices")

//***************************** OBTIENE LOS EVENTOS  ***********************************//
router.get("/", async (req, res) => {
  querys.executeQuery(`SELECT [IdCalendar]
    ,[IdUser]
    ,[IdRol]
    ,CONVERT(VARCHAR(MAX),[startDate], 22) AS startDate
    ,CONVERT(VARCHAR(MAX) ,[endDate], 22) AS endDate
    ,[title]
    ,[allDay]
    ,[rRule]
    ,[exDate]
    ,[notes]
    ,[members]
    ,[createDate]
    ,[status]
    ,[colorId]
    ,[Priority]
    ,[reminder]
FROM [dbo].[Calendar] where  status <> 8 order by IdCalendar`, req, res);
});

//***************************** INSERTA NUEVO EVENTOS  ***********************************//

router.post('/', (req, res) => {
  querys.executeQuery(`
    INSERT INTO [Finanzas].[dbo].[Calendar]
       ([IdUser]
          ,[IdRol]
          ,[startDate]
          ,[endDate]
          ,[title]
          ,[allDay]
          ,[rRule]
        --  , [exDate]
          ,[notes]
          ,[members]
          ,[createDate]
          ,[status]
          ,[colorId]
          ,[Priority]
          ,[reminder]
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
             ,${req.body.colorId}
             ,${req.body.Priority}
             ,${req.body.reminder}
             )`,
    req, res)
});

//***************************** ACTUALIZA LOS EVENTOS  ***********************************// 

router.put('/', (req, res) => {
  console.log('Edit', req.body)
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
       ,[status] = ${req.body.status}
       ,[colorId] = ${req.body.colorId}
       ,[Priority] = ${req.body.Priority}
      ,[reminder] = ${req.body.reminder}
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

router.put('/cancelarActividad/:IdCalendar', (req, res) => {
  // console.log('Editar Estado',req.params.IdCalendar)
  querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
   SET 
      [status] = 8
  WHERE IdCalendar = ${req.params.IdCalendar}`, req, res)
});

//***************************** Notificaiones  ***********************************//
router.get("/notificaciones", async (req, res) => {
  querys.executeQuery(`SELECT * FROM vta_CalendarioActividades ORDER BY vta_CalendarioActividades.endDate ASC`, req, res);
});

router.put('/cambiarEstado', async (req, res) => {
  console.log(req.body)
 const r = await querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
   SET [status] = ${req.body.Status} WHERE IdCalendar = ${req.body.IdCalendar}`, req)
   
   querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_allActivities] WHERE vta_allActivities.IdCalendar = ${req.body.IdCalendar}`, req, res)
});

router.get('/obtenerActividad/:IdCalendar', (req, res) => {
  // console.log('Editar Estado',req.params.IdCalendar)
  querys.executeQuery(`SELECT * FROM vta_CalendarioActividades WHERE vta_CalendarioActividades.IdCalendar = ${req.params.IdCalendar}`, req, res)
});

module.exports = router;