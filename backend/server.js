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


// Configura la conexión a la base de datos MySQL
/*const connection = mysql.createConnection({
    host: "dbdibujitos.cvqtg3vqsovm.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "LosDibujitos2023.2",
    database: "dbdibujitos",
});*/


// Middleware para cookies
app.use(cookieParser());

// Middleware para parsear las peticiones con contenido JSON
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


const routerAuth = require('./routes/auth').routerAuth;
const routerProyecto = require('./routes/proyecto').routerProyecto;
const routerEDT = require('./routes/EDT').routerEDT;
const routerHerramientas = require('./routes/herramientas').routerHerramientas;
<<<<<<< HEAD
=======

>>>>>>> 50f3bdc05e211f3e144478880b5c3d0ce790f2b4

app.use('/api/auth',routerAuth);
app.use('/api/proyecto',routerProyecto);
app.use('/api/EDT',routerEDT);
app.use('/api/herramientas',routerHerramientas);
<<<<<<< HEAD

=======
>>>>>>> 50f3bdc05e211f3e144478880b5c3d0ce790f2b4
//Empezar a escuchar en puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
