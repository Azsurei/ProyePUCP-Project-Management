const connection = require("../../config/db");

async function cambiarPassword(req,res,next){
    const {correo,password} = req.body;
    try {
        const query = `CALL CAMBIAR_PASSWORD_CUENTA_USUARIO(?,?);`;
        await connection.query(query,[correo,password]);
        res.status(200).json({message: `Password modificada`});
    } catch (error) {
        next(error);
    }
}

async function registrar(req,res,next){
    const { nombres, apellidos, correoElectronico, password,tieneCuentaGoogle } = req.body;
    console.log("Realizando registro de usuario...");

    const query = `CALL INSERTAR_CUENTA_USUARIO(?,?,?,?,?)`;
    try {
        const [results] = await connection.query(query, [
            nombres,
            apellidos,
            correoElectronico,
            password,
            tieneCuentaGoogle
        ]);
        const idUsuario = results[0][0].idUsuario;
        res.status(200).json({
            idUsuario,
            message: "Usuario registrado exitosamente.",
        });
        console.log(`Usuario ${idUsuario} agregado a la base de datos`);
    } catch (error) {
        if(error.code === "ER_DUP_ENTRY"){
            return res.status(409).json({
                message: "El correo electrónico ya está registrado. Por favor, utiliza uno diferente."
            });
        }else{
            res.status(500).send("Error en el registro: " + error.message);
        }
        console.error("Error en el registro:", error);
    }
}

async function verificarSiCorreoEsDeGoogle(req,res,next){
    const {correoElectronico} = req.body;
    try {
        const query = `CALL VERIFICAR_SI_CORREO_ES_DE_GOOGLE(?);`;
        const [results] = await connection.query(query,[correoElectronico]);
        console.log(results[0][0]);
        let tieneCuentaGoogle = results[0][0].tieneCuentaGoogleBoolean;
        if(tieneCuentaGoogle === 1){
            tieneCuentaGoogle=true;
        }else{
            tieneCuentaGoogle=false;
        }
        res.status(200).json({tieneCuentaGoogle, message: "Se verificó si el correo es de google"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registrar,
    cambiarPassword,
    verificarSiCorreoEsDeGoogle
}