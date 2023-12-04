const connection = require("../config/db");
const cookie = require("cookie");
require('dotenv').config({ path: './../../.env' });
//de jsonwebtokens
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; 


async function login(req, res, next) {
    const { username, password } = req.body;
    console.log("Realizando verificación de usuario...");
    //Verificamos si usuario se encuentra en la base de datos
    const query = `CALL VERIFICAR_CUENTA_USUARIO(?,?);`;

    try {
        const [results] = await connection.query(query, [username, password]);
        const idUsuario = results[0][0].idUsuario;
        const idRol = results[0][0].idRol;    
        const habilitado = results[0][0].habilitado;
        if (idUsuario != 0) {
            const user = {
                id: idUsuario,
                mail: username,
                rol: idRol,
                habilitado: habilitado
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
}

// Esta opcion es para cuando uno se registra por el sistema 
// y luego quiere entrar con Google
async function loginXCorreo(req, res, next) {
    const { correoElectronico } = req.body;
    console.log("Realizando verificación de si el usuario está en el sistema...");
    const query = `CALL VERIFICAR_CUENTA_USUARIO_X_CORREO(?);`;
    // Este procedure verifica si el usuario ha registrado una cuenta de Google
    // mediante el sistema NO por Google.
    // Si el usuario tiene una cuenta en el sistema con un correo que coincide con la 
    // cuentaGoogle que intenta acceder tieneCuentaGoogle se actualiza a 1
    try {
        const [results] = await connection.query(query, [correoElectronico]);
        const idUsuario = results[0][0].idUsuario;
        const idRol = results[0][0].idRol;
        const habilitado = results[0][0].habilitado;
        if (idUsuario != 0) {
            const user = {
                id: idUsuario,
                mail: correoElectronico,
                rol: idRol,
                habilitado: habilitado
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
            res.status(417).send("Nombre de usuario o contraseña incorrectos. O el correo no está en el sistema");
        }
        /*
        res.status(200).json({
            usuarios: results[0],
            message: "Usuarios obtenidos exitosamente",
        });
        */
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(500).send("Error en la autenticación: " + error.message);
        next(error);
    }
}

async function loginImg(req, res, next) {
    const { username, password, imgLink } = req.body;
    console.log("Realizando verificación de usuario...");
    //Verificamos si usuario se encuentra en la base de datos
    const query = `CALL VERIFICAR_CUENTA_USUARIO(?,?);`;

    try {
        const [results] = await connection.query(query, [username, password]);
        const idUsuario = results[0][0].idUsuario;
        const idRol = results[0][0].idRol;    
        const habilitado = results[0][0].habilitado;
        if (idUsuario != 0) {
            const updQuery = `UPDATE Usuario SET imgLink = '${imgLink}' WHERE idUsuario = ${idUsuario};`;
            const [results2] = await connection.query(updQuery);

            const user = {
                id: idUsuario,
                mail: username,
                rol: idRol,
                habilitado: habilitado
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
}

async function logout(req, res, next) {
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
}

async function private(req, res, next) {
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
}


module.exports = {
    login,
    loginXCorreo,
    loginImg,
    logout,
    private
};