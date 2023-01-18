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
const sesiones = require('./src/routers/Usuarios/sesionesRouter');


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
app.use('/sesiones', sesiones);

app.listen(process.env.PORT, async () => {
    console.log('EL SERVIDOR ESTA ESCUCHANDO EN EL PUERTO:', process.env.PORT);
});