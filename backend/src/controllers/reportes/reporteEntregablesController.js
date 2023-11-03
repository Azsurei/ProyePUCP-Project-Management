const connection = require("../../config/db");

async function generarReporteEntregables(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_ENTREGABLES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        const entregables = results[0];

        console.log("Entregables listados con exito ====" + JSON.stringify(entregables,null,2));
        
        res.status(200).json({
            entregables,
            message: "Se listaron los entregables con exito"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}



module.exports = {
    generarReporteEntregables
};