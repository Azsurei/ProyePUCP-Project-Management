const connection = require("../../config/db");
const itemLineaRetrospectivaController = require("./itemLineaRetrospectivaController");

async function crear(req,res,next){
    const {idRetrospectiva,idSprint,cantBien,cantMal,cantQueHacer} = req.body;
    try {
        const idLineaRetrospectiva=await funcCrear(idRetrospectiva,idSprint,cantBien,cantMal,cantQueHacer);
        res.status(200).json({
            idLineaRetrospectiva,
            message: `Linea retrospectiva ${idLineaRetrospectiva} creada`});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idRetrospectiva,idSprint,cantBien,cantMal,cantQueHacer){
    try {
        const query = 'CALL INSERTAR_LINEA_RETROSPECTIVA(?,?,?,?,?);';
        const [result] = await connection.query(query,[idRetrospectiva,idSprint,cantBien,cantMal,cantQueHacer]);
        const idLineaRetrospectiva =result[0][0].idLineaRetrospectiva;
        return idLineaRetrospectiva;
    } catch (error) {
        throw error;
    }
}

async function listarXIdRetrospectiva(req,res,next){
    const {idRetrospectiva} = req.params;
    try {
        const query = `CALL LISTAR_LINEA_RETROSPECTIVA_X_ID_RETROSPECTIVA(?);`;
        const [results] = await connection.query(query,[idRetrospectiva]);
        lineasRetrospectiva = results[0];
        
        res.status(200).json({
            lineasRetrospectiva,
            message: "LineasRetrospectiva listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function modificar(req,res,next){
    const {idLineaRetrospectiva,idSprint,cantBien,cantMal,cantQueHacer} = req.body;
    try {
        const query = `CALL MODIFICAR_LINEA_RETROSPECTIVA(?,?,?,?,?);`;
        await connection.query(query,[idLineaRetrospectiva,idSprint,cantBien,cantMal,cantQueHacer]);
        res.status(200).json({message: `Linea retrospectiva ${idLineaRetrospectiva} modificada`});
    } catch (error) {
        next(error);
    }
}

async function eliminar(req,res,next){
    const {idLineaRetrospectiva} = req.body;
    try {
        await funcEliminar(idLineaRetrospectiva);
        await itemLineaRetrospectivaController.eliminarXIdLineaRetrospectiva(idLineaRetrospectiva);

        res.status(200).json({message: `Linea retrospectiva ${idLineaRetrospectiva} eliminada`});
    } catch (error) {
        next(error);
    }
}

async function funcEliminar(idLineaRetrospectiva){
    try {
        const query = `CALL ELIMINAR_LINEA_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA(?);`;
        await connection.query(query,[idLineaRetrospectiva]);
    } catch (error) {
        throw error;
    }
}

module.exports={
    crear,
    listarXIdRetrospectiva,
    modificar,
    eliminar
}