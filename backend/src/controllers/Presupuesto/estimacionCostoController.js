const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPresupuesto,subtotal,reservaContigencia,lineaBase,ganancia,IGV} = req.body;
    try {
        const query = `CALL INSERTAR_ESTIMACION_COSTO(?,?,?,?,?,?);`;
        await connection.query(query,[idPresupuesto,subtotal,reservaContigencia,lineaBase,ganancia,IGV]);
        res.status(200).json({message: "Estimacion costo creada"});
    } catch (error) {
        next(error);
    }
}

async function crearLineaEstimacionCosto(req,res,next){
    const {idLineaEgreso,idMoneda,idEstimacion,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_ESTIMACION_COSTO(?,?,?,?,?,?,?,?);`;
        await connection.query(query,[idLineaEgreso,idMoneda,idEstimacion,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio]);
        res.status(200).json({message: "Linea  estimacion costo"});
    } catch (error) {
        next(error);
    }
}

async function listarLineasTodas(req,res,next){
    const {idLineaEstimacionCosto} = req.body;
    try {
        const query = `CALL ELIMINAR_LINEA_ESTIMACION_COSTO(?);`;
        await connection.query(query,[idLineaEstimacionCosto]);
        res.status(200).json({message: "Linea estimacion costo eliminada"});
    } catch (error) {
        next(error);
    }
}
async function eliminarLineaEstimacionCosto(req,res,next){
    const {idLineaEstimacionCosto} = req.body;
    try {
        const query = `CALL ELIMINAR_LINEA_ESTIMACION_COSTO(?);`;
        await connection.query(query,[idLineaEstimacionCosto]);
        res.status(200).json({message: "Linea estimacion costo eliminada"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    crearLineaEstimacionCosto,
    eliminarLineaEstimacionCosto
};