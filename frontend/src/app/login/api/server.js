const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const secret = "secretKey";

const app = express();
const port = 8080;

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: "dbdibujitos.cvqtg3vqsovm.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "LosDibujitos2023.2",
    database: "dbdibujitos",
});

//Caso de error en la base de datos
connection.connect((err) => {
    if (err) {
        console.error("Error de conexión a la base de datos: " + err.stack);
        return;
    }
    console.log("Conexión a la base de datos MySQL establecida");
});

// Middleware para parsear las peticiones con contenido JSON
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// ENDPOINT: Autenticación de usuario
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    //Verificamos si usuario se encuentra en la base de datos
    const query = `
        CALL LOGIN('${username}', '${password}');
    `;

    connection.query(query, (error, results) => {
        if (error) {
            //Error en query
            res.status(402).send("Error en la autenticación");
        } else {
            //Query exitoso
            const user = {
                username: username,
                password: password,
            };
            console.log(`${username} y ${password}`);
            const autenticado = results[0][0].Autenticado;

            if (autenticado === 1) {
                //Usuario existe

                //procesamos token
                const token = jwt.sign(
                    {
                        user,
                        exp: Date.now() + 60 * 1000,
                    },
                    secret
                );

                res.status(200).send(token);
                //res.status(200).send('Autenticación exitosa');
            } else {
                res.status(401).send(
                    "Nombre de usuario o contraseña incorrectos"
                );
            }
        }
    });
});

//endpoint de prueba para verificar que el acceso solo se podra con el token
app.get("/private", (req, res) => {
    //Se encierra todo en un try catch debido a que se puede dar el caso en que token ya no sea valido
    try {
        //Bearer aoisnioawnfoiwnfio (token)
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);

        //Verificar que token no haya excedido su limite
        if (Date.now() > payload.exp) {
            return res.status(401).send({ error: "Token has expired" });
        }

        //Se continua con el proceso normal
        res.send(
            "Accediste a un metodo tras la verificacion del token con un limite de 60 segundos"
        );
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

//ENDPOINT: Registro de usuario
app.post("/api/register", (req, res) => {
    const { nombres, apellidos, correoElectronico, password } = req.body;

    const query = `
    CALL REGISTRAR('${nombres}', '${apellidos}', '${correoElectronico}', '${password}');
  `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error en el registro:", error);
            res.status(500).send("Error en el registro: " + error.message);
        } else {
            const idUsuario = results[0][0].idUsuario;
            res.status(200).json({
                idUsuario,
                message: "Usuario registrado exitosamente",
            });
        }
    });
});

//Empezar a escuchar en puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
