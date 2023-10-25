const connection = require("../../config/db");

async function crear(req,res,next){
    const {idAcuerdo,idUsuarioXRolXProyecto} = req.body;
    try {
        idResponsableAcuerdo = await funcCrear(idAcuerdo,idUsuarioXRolXProyecto);
        res.status(200).json({
            idResponsableAcuerdo,
            message: "Responsable acuerdo creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdAcuerdo(req,res,next){
    const {idAcuerdo} = req.params;
    try {
        responsablesAcuerdo = await funcListarXIdAcuerdo(idAcuerdo);
        res.status(200).json({
            responsablesAcuerdo,
            message: "Responsables acuerdo listados"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idAcuerdo,idUsuarioXRolXProyecto){
   try{
        const query = `CALL INSERTAR_RESPONSABLE_ACUERDO(?,?);`;
        const [results] = await connection.query(query,[idAcuerdo,idUsuarioXRolXProyecto]);
        idResponsableAcuerdo = results[0][0].idResponsableAcuerdo;
   }catch(error){
        next(error)
   }
    return idResponsableAcuerdo;
}

async function funcListarXIdAcuerdo(idAcuerdo){
    let responsablesAcuerdo;
    try {
        const query = `CALL LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO(?);`;
        const [results] = await connection.query(query,[idAcuerdo]);
        responsablesAcuerdo = results[0];
    } catch (error) {
        console.error("Error al listar comentarios de reunion:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return responsablesAcuerdo;
}

module.exports = {
    crear,
    listarXIdAcuerdo,
    funcCrear,
    funcListarXIdAcuerdo
}