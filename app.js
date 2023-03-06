//*********** Librerias ***********/
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require('cors');

//***************** Rutas de Routers *****************/
const usuarioRouter = require('./src/routers/Usuarios/usuarioRouter');
const rolesRouter = require('./src/routers/Roles/rolesRouter');
const permisosRouter = require('./src/routers/Usuarios/PermisosRouter');
const sesionesRouter = require('./src/routers/Usuarios/sesionesRouter');
const statusRouter = require('./src/routers/Estados/StatusRouter');
const menuRouter = require('./src/routers/Menu/menuRouter');
const permisosNivelRouter = require('./src/routers/Usuarios/PermisosNivelRouter');
const emailRouter = require('./src/routers/Herramientas/EnviarMailRouter');

//***************** Rutas de Routers Finanzas *****************/

const classesRouter = require('./src/routers/Finanzas/classesRouter')

//***************** Rutas de Resgistro Contable *****************/

const planCuentasRouter = require('./src/routers/Finanzas/PlanCuentas/planCuentasRouter');
const subTypeRouter = require('./src/routers/Finanzas/PlanCuentas/subTypeRouter');
const typeRouter = require('./src/routers/Finanzas/PlanCuentas/typeRouter');
const currencyRouter = require('./src/routers/Generales/Currency/currencyRouter')
const categoriaRouter = require('./src/routers/Finanzas/PlanCuentas/categoriasRouter');
const subCategoriaRouter = require('./src/routers/Finanzas/PlanCuentas/subCategoriasRouter')

//***************** Rutas de Routers GENERALES*****************/

const accesosWebRouter = require('./src/routers/Accesos/accesosRouter');
const schedulerRouter = require('./src/routers/Scheduler/Scheduler');
const prioridadRouter = require('./src/routers/Generales/Prioridad/PrioridadRouter');
const terminosRouter = require('./src/routers/Generales/Terminos/TerminosRouter');
const tipoPagosRouter = require('./src/routers/Generales/TipoPago/TipoPagoRouter');
const unidadesRouter = require('./src//routers/Generales/Unidades/UnidadesRouter');


//***************** Rutas de Routers HERRAMIENTAS*****************/

const notificacionesWebRouter = require('./src/routers/Herramientas/Notificaciones/notificacionesWebRouter');


//***************** Rutas de Routers clientes*****************/
const clientesRouter = require('./src/routers/Clientes/clientesRouter');

const app = express();

app.use(cors({ origin: true, credentials: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: 2147483647 }));
app.use(bodyParser.urlencoded({ extended: true, limit: 2147483647}));
app.use(express.urlencoded({extended: false}));       
app.use(express.json());
// app.use(require('express-status-monitor')());

//****************************** Usuarios ******************************/
app.use('/users', usuarioRouter);

//****************************** Roles ******************************/
app.use('/roles',rolesRouter);

//****************************** Menu ******************************/
app.use('/permisos',permisosRouter);

//****************************** Sesiones ******************************/
app.use('/sesiones', sesionesRouter);

//****************************** EStados ******************************/
app.use('/status',statusRouter);

//****************************** Menu ******************************/
app.use('/menu',menuRouter);

//****************************** Permisos Niveles Menu ******************************/
app.use('/permisosNivel', permisosNivelRouter);


//****************************** Envio de Mails ******************************/
app.use('/email', emailRouter)


//****************************** Finanzas ******************************/
app.use("/finanzas/classes", classesRouter)
app.use('/schedulerCalendar', schedulerRouter)

//****************************** Finanzas-Registro Contable ******************************/
app.use('/finanzas/planCuentas', planCuentasRouter)
app.use('/finanzas/subTypes', subTypeRouter)
app.use('/finanzas/types', typeRouter)
app.use('/finanzas/currency', currencyRouter)
app.use('/finanzas/categorias', categoriaRouter)
app.use('/finanzas/subCategorias',subCategoriaRouter)


//****************************** Accesos ******************************/

app.use('/accesos', accesosWebRouter)

//****************************** Prioridad ******************************/

app.use('/prioridad', prioridadRouter)


//****************************** Herramientas******************************/

app.use('/notificaciones', notificacionesWebRouter)

//****************************** Clientes ******************************/
app.use('/clientes', clientesRouter)

//****************************** Generales ******************************/
app.use('/generales/terminos', terminosRouter);
app.use('/generales/tipoPagos', tipoPagosRouter);
app.use('/generales/unidades', unidadesRouter)

app.listen(process.env.PORT, async () => {
    console.log('EL SERVIDOR ESTA ESCUCHANDO EN EL PUERTO:', process.env.PORT);
});