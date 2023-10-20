const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto,idMoneda,presupuestoInicial,cantidadMeses} = req.body;
    try {
        const query = `CALL INSERTAR_PRESUPUESTO(?,?);`;
        await connection.query(query,[idProyecto,idMoneda,presupuestoInicial,cantidadMeses]);
        res.status(200).json({message: "Presupuesto creada"});
    } catch (error) {
        next(error);
    }
}


async function listarLineasTodas(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_LINEA_EGRESO_X_ID_PROYECTO(?);`;
        const [resultsLineasIngreso] = await connection.query(query,[idProyecto]);
        lineasIngreso = resultsLineasIngreso[0];
        
        const query2 = `CALL LISTAR_LINEA_INGRESO_X_ID_PROYECTO(?);`;
        const [resultsLineasEgreso] = await connection.query(query2,[idProyecto]);
        lineasEgreso = resultsLineasEgreso[0];

        const query3 = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PROYECTO(?);`;
        const [resultsLineasEstimacionCosto] = await connection.query(query3,[idProyecto]);
        lineasEstimacionCosto = resultsLineasEstimacionCosto[0];

        const lineasPresupuesto = {};
        lineasPresupuesto.lineasIngreso = lineasIngreso;
        lineasPresupuesto.lineasEgreso = lineasEgreso;
        lineasPresupuesto.lineasEstimacionCosto = lineasEstimacionCosto;

        res.status(200).json({
            lineasPresupuesto,
            message: "Lineas del presupuesto listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    crear,
    listarLineasTodas
};