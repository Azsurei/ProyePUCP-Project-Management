const connection = require("../../config/db");
const responsableAcuerdoController = require("./responsableAcuerdoController");

async function crear(req,res,next){
    const {idTemaReunion,descripcion,fechaObjetivo,responsables} = req.body;
    try {
        idAcuerdo = await funcCrear(idTemaReunion,descripcion,fechaObjetivo,responsables);
        res.status(200).json({
            idAcuerdo,
            message: "Acuerdo creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdTemaReunion(req,res,next){
    const {idTemaReunion} = req.params;
    try {
        
        const acuerdos = await funcListarXIdTemaReunion(idTemaReunion);
        res.status(200).json({
            acuerdos,
            message: "Acuerdos listados"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idTemaReunion,descripcion,fechaObjetivo,responsables){
    try {
        const query = `CALL INSERTAR_ACUERDO(?,?,?);`;
        const [results]=await connection.query(query,[idTemaReunion,descripcion,fechaObjetivo]);
        idAcuerdo = results[0][0].idAcuerdo;
        for(responsable of responsables){
            responsableAcuerdoController.funcCrear(idAcuerdo,responsable.idUsuarioXRolXProyecto);
        }
    } catch (error) {
        next(error);
    }
    return idAcuerdo;
}

async function funcListarXIdTemaReunion(idTemaReunion){
    let acuerdos;
    try {
        const query = `CALL LISTAR_ACUERDO_X_ID_TEMA_REUNION(?);`;
        const [results] = await connection.query(query,[idTemaReunion]);
        acuerdos = results[0];
    } catch (error) {
        console.error("Error al listar comentarios de reunion:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return acuerdos;
}

async function funcModificar(idAcuerdo,descripcion,fechaObjetivo,responsables){
    try {
        const query = `CALL MODIFICAR_ACUERDO(?,?,?);`;
        const [results]=await connection.query(query,[idAcuerdo,descripcion,fechaObjetivo]);
        for(responsable of responsables){
            responsableAcuerdoController.funcModificar(idAcuerdo,responsable.idUsuarioXRolXProyecto);
        }
    } catch (error) {
        next(error);
    }

}


module.exports = {
    crear,
    listarXIdTemaReunion,
    funcCrear,
    funcListarXIdTemaReunion
}