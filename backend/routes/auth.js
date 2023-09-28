const express = require('express');
const connection = require('../config/db');
const routerAuth = express.Router();

routerAuth.get('/',(req,res)=>{
    console.log("Llegue a autenticacion");
    res.send(JSON.stringify("LLEGUE A LOGGIN"));
});

routerAuth.post("/login", async(req, res) => {
    const { username, password } = req.body;
    console.log("llegue a loggin");
    //Verificamos si usuario se encuentra en la base de datos
    const query = `
        CALL VERIFICAR_CUENTA_USUARIO('${username}', '${password}');
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

//ENDPOINT: Registro de usuario
routerAuth.post("/register", async (req, res) => {

    const { nombres, apellidos, correoElectronico, password } = req.body;
    console.log("Se recibio solicitud post en register");

    let dummy;
    
    const query = `CALL INSERTAR_CUENTA_USUARIO(?, ?, ?, ?, ?);`;
    try {
        const [results] = await connection.query(query,[dummy,nombres, apellidos, correoElectronico, password] );
        const idUsuario = results[0][0].idUsuario;
        res.status(200).json({
            idUsuario,
            message: "Usuario registrado exitosamente",
        });
        console.log(`Usuario ${idUsuario} agregado a la base de datos`);
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
});


//endpoint de prueba para verificar que el acceso solo se podra con el token
routerAuth.get("/private", (req, res) => {
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

module.exports.routerAuth = routerAuth;