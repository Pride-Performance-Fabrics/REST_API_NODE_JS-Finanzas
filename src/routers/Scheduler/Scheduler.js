const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
const crypterService = require("../../services/crypto");
const jwk = require("jsonwebtoken");

const { obtenerUsuario } = require("../../utils/funciones")

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

router.post('/', async (req, res) => {
  const IdUsuario = await obtenerUsuario(req)
  console.log(IdUsuario)
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
          ,[Priority]
          ,[reminder]
          ,[IdUserEdit]
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
             ,${req.body.Priority}
             ,${req.body.reminder}
             ,${IdUsuario}
             )`,
    req, res)
});

//***************************** ACTUALIZA LOS EVENTOS  ***********************************// 

router.put('/', async (req, res) => {
  const IdUsuario = await obtenerUsuario(req)
  console.log(IdUsuario)
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
       ,[Priority] = ${req.body.Priority}
      ,[reminder] = ${req.body.reminder}
      ,[IdUserEdit] = ${IdUsuario}
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

router.put('/cancelarActividad/:IdCalendar', async (req, res) => {

  const IdUsuario = await obtenerUsuario(req)
  console.log(IdUsuario)

  querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
   SET 
      [status] = 8
      ,[IdUserEdit] = ${IdUsuario}
  WHERE IdCalendar = ${req.params.IdCalendar}`, req, res)
});

//***************************** Notificaiones  ***********************************//
router.get("/notificaciones", async (req, res) => {
  querys.executeQuery(`SELECT * FROM vta_CalendarioActividades ORDER BY vta_CalendarioActividades.endDate ASC`, req, res);
});

router.put('/cambiarEstado', async (req, res) => {
  const IdUsuario = await obtenerUsuario(req)
  console.log(IdUsuario)
  let dateEdit = setDateTimeSQL(new Date())
  console.log(dateEdit)
  switch (req.body.Status) {
    case 6:
    const r6 = await querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
      SET [status] = ${req.body.Status}, [IdUserProcess] = ${IdUsuario}, [processStatusDate] = '${dateEdit}' WHERE IdCalendar = ${req.body.IdCalendar}`, req)
      querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_allActivities] WHERE vta_allActivities.IdCalendar = ${req.body.IdCalendar}`, req, res)
      break;

    case 7:
     const r7 = await querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
        SET [status] = ${req.body.Status}, [IdUserComplete] = ${IdUsuario}, [completetStatusDate] = '${dateEdit}' WHERE IdCalendar = ${req.body.IdCalendar}`, req)
      querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_allActivities] WHERE vta_allActivities.IdCalendar = ${req.body.IdCalendar}`, req, res)
      break;

    case 8:
      const r8 = await querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
            SET [status] = ${req.body.Status}, [IdUserCancel] = ${IdUsuario}, [cancelStatusDate] = '${dateEdit}' WHERE IdCalendar = ${req.body.IdCalendar}`, req)
      querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_allActivities] WHERE vta_allActivities.IdCalendar = ${req.body.IdCalendar}`, req, res)
      break;

    default:
      const r5 = await querys.executeQuery(`UPDATE [Finanzas].[dbo].[Calendar]
      SET [status] = ${req.body.Status}, [IdUserEdit] = ${IdUsuario} WHERE IdCalendar = ${req.body.IdCalendar}`, req)
      querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_allActivities] WHERE vta_allActivities.IdCalendar = ${req.body.IdCalendar}`, req, res)
      break;
      
  }
});

router.get('/obtenerActividad/:IdCalendar', (req, res) => {
  // console.log('Editar Estado',req.params.IdCalendar)
  querys.executeQuery(`SELECT * FROM vta_CalendarioActividades WHERE vta_CalendarioActividades.IdCalendar = ${req.params.IdCalendar}`, req, res)
});

router.get('/cantidadActividades/', (req, res) => {
  // console.log('Editar Estado',req.params.IdCalendar)
  querys.executeQuery(`SELECT COUNT ([IdCalendar]) as Cantidad
  FROM [dbo].[Calendar] where  status <> 8 `, req, res)
});

router.get('/allActivities', (req, res) =>{
  console.log("entro aqui")
  querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_allActivities]`, req, res)
})

module.exports = router;