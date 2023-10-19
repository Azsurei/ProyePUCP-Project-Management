const express = require("express");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const secret = "secretKey";
const app = express();
const port = 8080;
//Usamos el router de loggin
//const routerProgramacion = require('../../routes/routerLogin').routerLoggin;
//app.use('/api/loggin',routerProgramacion);

// Middleware para cookies
app.use(cookieParser());

// Middleware para parsear las peticiones con contenido JSON
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost", credentials: true }));


const routerAuth = require('./routes/auth').routerAuth;
const routerProyecto = require('./routes/proyecto').routerProyecto;
const routerUsuario = require('./routes/usuario').routerUsuario;
const routerHerramientas = require('./routes/herramientas').routerHerramientas;

app.use('/api/herramientas',routerHerramientas);
app.use('/api/auth',routerAuth);
app.use('/api/proyecto',routerProyecto);
app.use('/api/usuario',routerUsuario);

//Empezar a escuchar en puerto 8080
const PORT = process.env.PORT || port;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});