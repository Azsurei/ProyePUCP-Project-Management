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

async function eliminar(req, res, next) {
    const { idReporteXProyecto } = req.body;
    try {
        const query = `CALL ELIMINAR_REPORTE_PROYECTO(?);`;
        await connection.query(query, [idReporteXProyecto]);
        console.log(`Reporte ${idReporteXProyecto} eliminado`);    
        res.status(200).json({
            message: "Reporte eliminado exitosamente"
        });
    } catch (error) {
        console.log("Error en la eliminacion ",error);
        res.status(500).send("Error en la eliminacion: " + error.message);
        next(error);
    }
}

module.exports = {
    listarReportesXIdProyecto,
    eliminar
}