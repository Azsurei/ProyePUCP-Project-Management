const express = require("express");
const connection = require("../config/db");
const routerAuth = express.Router();
const cookie = require("cookie");

//de jsonwebtokens
const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda"; //es un tipo de password que se necesita, en futuro se movera

routerAuth.get("/", (req, res) => {
    console.log("Llegue a autenticacion");
    res.send(JSON.stringify("LLEGUE A LOGGIN"));
});

routerAuth.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("Realizando verificación de usuario...");
    //Verificamos si usuario se encuentra en la base de datos

    const query = `
        CALL VERIFICAR_CUENTA_USUARIO('${username}', '${password}');
    `;

    try {
        const [results] = await connection.query(query);
        const idUsuario = results[0][0].idUsuario;
        if (idUsuario != 0) {
            const user = {
                id: idUsuario,
                mail: username,
            };

            //procesamos token
            const token = jwt.sign(
                {
                    user,
                },
                secret,
                { expiresIn: "3h" }
            );

            const serialized = cookie.serialize("tokenProyePUCP", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30,
                path: "/",
            });

            res.setHeader("Set-Cookie", serialized);

            user.token = token;
            console.log(`El usuario ${idUsuario} se ha autenticado.`);
            res.status(200).json(user);
        } else {
            console.log(`No se ha autenticado al usuario.`);
            res.status(401).send("Nombre de usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(500).send("Error en la autenticación: " + error.message);
    }
});

//ENDPOINT: Registro de usuario
routerAuth.post("/register", async (req, res) => {
    const { nombres, apellidos, correoElectronico, password } = req.body;
    console.log("Realizando registro de usuario...");

    let dummy;

    const query = `CALL INSERTAR_CUENTA_USUARIO(?, ?, ?, ?)`;
    try {
        const [results] = await connection.query(query, [
            nombres,
            apellidos,
            correoElectronico,
            password,
        ]);
        const idUsuario = results[0][0].idUsuario;
        res.status(200).json({
            idUsuario,
            message: "Usuario registrado exitosamente.",
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
