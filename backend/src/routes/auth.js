const express = require("express");
const connection = require("../config/db");
const routerAuth = express.Router();
const cookie = require("cookie");
require('dotenv').config({ path: './../../.env' });

//de jsonwebtokens
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; 
const usuarioController = require("../controllers/usuario/usuarioController");
const { verifyToken } = require("../middleware/middlewares");

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
        const idRol = results[0][0].idRol;    
        if (idUsuario != 0) {
            const user = {
                id: idUsuario,
                mail: username,
                rol: idRol,
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
            res.status(417).send("Nombre de usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(500).send("Error en la autenticación: " + error.message);
    }
});

// Esta opcion es para cuando uno se registra por el sistema y
// luego quiere entrar con Google
routerAuth.post("/loginXCorreo", usuarioController.loginXCorreo);

routerAuth.post("/loginImg", async (req, res) => {
    const { username, password, imgLink } = req.body;
    console.log("Realizando verificación de usuario...");
    //Verificamos si usuario se encuentra en la base de datos

    const query = `
        CALL VERIFICAR_CUENTA_USUARIO('${username}', '${password}');
    `;

    try {
        const [results] = await connection.query(query);
        const idUsuario = results[0][0].idUsuario;
        const idRol = results[0][0].idRol;    
        if (idUsuario != 0) {
            const updQuery = `UPDATE Usuario SET imgLink = '${imgLink}' WHERE idUsuario = ${idUsuario};`;
            const [results2] = await connection.query(updQuery);

            const user = {
                id: idUsuario,
                mail: username,
                rol: idRol,
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
            res.status(417).send("Nombre de usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(500).send("Error en la autenticación: " + error.message);
    }
});





//ENDPOINT: Registro de usuario
routerAuth.post("/register", usuarioController.registrar);
routerAuth.post("/verificarSiCorreoEsDeGoogle", usuarioController.verificarSiCorreoEsDeGoogle);

//ENDPOINT: Registro de usuario
routerAuth.get("/logout", async (req, res) => {
    console.log("Realizando logout...");
    try {
        const serialized = cookie.serialize("tokenProyePUCP", null, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json('logout con exito');

        console.log(`se ha hecho el logout`);
    } catch (error) {
        console.error("Error en el logout:", error);
        res.status(500).send("Error en el logout: " + error.message);
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

// Modificar. Este modificar no modifica ni el correo ni la contraseña
routerAuth.put("/modificarUsuario", verifyToken, usuarioController.modificarDatos);


module.exports.routerAuth = routerAuth;
