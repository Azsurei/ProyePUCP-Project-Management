const express = require("express");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const secret = "secretKey";
require('dotenv').config({ path: './../.env' });
const app = express();
const port = 8080;
//Usamos el router de loggin
//const routerProgramacion = require('../../routes/routerLogin').routerLoggin;
//app.use('/api/loggin',routerProgramacion);

// Middleware para cookies
app.use(cookieParser());

// Middleware para parsear las peticiones con contenido JSON
app.use(bodyParser.json());
app.use(cors({ origin: process.env.SERVER_URL, credentials: true }));

const routerAuth = require('./routes/auth').routerAuth;
const routerProyecto = require('./routes/proyecto').routerProyecto;
const routerUsuario = require('./routes/usuario').routerUsuario;
const routerHerramientas = require('./routes/herramientas').routerHerramientas;
const routerAdmin = require('./routes/admin').routerAdmin;
const routerFiles = require('./routes/files').routerFiles;

app.use('/api/herramientas',routerHerramientas);
app.use('/api/auth',routerAuth);
app.use('/api/proyecto',routerProyecto);
app.use('/api/usuario',routerUsuario);
app.use('/api/admin',routerAdmin);
app.use('/api/files',routerFiles);

const startCronJob = require('./config/cronJobs');

startCronJob();

//Empezar a escuchar en puerto 8080
const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});