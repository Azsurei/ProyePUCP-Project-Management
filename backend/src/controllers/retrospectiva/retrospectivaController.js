const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        const idRetrospectiva=await funcCrear(idProyecto);
        res.status(200).json({
            idRetrospectiva,
            message: `Retrospectiva ${idRetrospectiva}creada`});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idProyecto){
    try {
        const query = 'INSERTAR_RETROSPECTIVA(?)';
        const [result] = await connection.query(query,[idProyecto]);
        console.log(result[0].idRetrospectiva);
        return result[0].idRetrospectiva;
    } catch (error) {
        throw error;
    }
}

async function eliminar(req,res,next){
    const { idRetrospectiva } = req.params;
    console.log(`Procediendo: Eliminar/Retrospectiva ${idRetrospectiva}...`);
    try {
        const result = await funcEliminar(idRetrospectiva);
        res.status(200).json({
            idRetrospectiva,
            message: "Retrospectiva eliminado"});
        console.log(`Retrospectiva ${idRetrospectiva} eliminado.`);
    } catch (error) {
        next(error);
    }
}

async function funcEliminar(idRetrospectiva) {
    try {
        const query = `CALL ELIMINAR_RETROSPECTIVA_X_ID_RETROSPECTIVA(?);`;
        [results] = await connection.query(query,[idRetrospectiva]);
    } catch (error) {
        console.log("ERROR en Eliminar/Retrospectiva", error);
        return 0;
    }
    return 1;
}


module.exports={
    crear,
    eliminar
}