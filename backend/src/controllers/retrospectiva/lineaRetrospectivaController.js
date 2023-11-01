const connection = require("../../config/db");

async function crear(req,res,next){
    const {idRetrospectiva,idEquipo,cantBien,cantMal,cantQueHacer} = req.body;
    try {
        const idLineaRetrospectiva=await funcCrear(idRetrospectiva,idEquipo,cantBien,cantMal,cantQueHacer);
        res.status(200).json({
            idLineaRetrospectiva,
            message: `Retrospectiva ${idRetrospectiva}creada`});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idRetrospectiva,idEquipo,cantBien,cantMal,cantQueHacer){
    try {
        const query = 'CALL INSERTAR_LINEA_RETROSPECTIVA(?,?,?,?,?);';
        const [result] = await connection.query(query,[idRetrospectiva,idEquipo,cantBien,cantMal,cantQueHacer]);
        console.log(result[0].idRetrospectiva);
        return result[0].idLineaRetrospectiva;
    } catch (error) {
        throw error;
    }
}


module.exports={
    crear
}