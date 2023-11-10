const connection = require("../../config/db");

async function listarReportesXIdProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_REPORTES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json(results[0]);
    } catch (error) {
        next(error);
    }
}   

module.exports = {
    listarReportesXIdProyecto
}