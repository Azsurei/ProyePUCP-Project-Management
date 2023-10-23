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

// async function listarLineasTodas(req,res,next){
//     const {idLineaEstimacionCosto} = req.body;
//     try {
//         const query = `CALL ELIMINAR_LINEA_ESTIMACION_COSTO(?);`;
//         await connection.query(query,[idLineaEstimacionCosto]);
//         res.status(200).json({message: "Linea estimacion costo eliminada"});
//     } catch (error) {
//         next(error);
//     }
// }

async function listarLineasXNombreFechas(req,res,next){
    const {idProyecto,descripcion,fechaIni,fechaFin} = req.params;
    const processeddescripcion = descripcion !== 'NULL' ? descripcion : null;
    const processedfechaIni = fechaIni !== 'NULL' ? fechaIni : null;
    const processedfechaFin = fechaFin !== 'NULL' ? fechaFin : null;

    try {
        const query = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PROYECTO_NOMBRE_FECHAS(?,?,?,?);`;
        const [resultsLineasEstimacionCosto] = await connection.query(query,[idProyecto,processeddescripcion,processedfechaIni,processedfechaFin]);
        lineasEstimacionCosto = resultsLineasEstimacionCosto[0];
        
        res.status(200).json({
            lineasEstimacionCosto,
            message: "Lineas de estimacion costo listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}

// Definir una función para obtener líneas de estimación de costo
// async function listarLineasXIdProyecto(req,res,next) {
//     const { idProyecto } = req.params;
//     const query = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PROYECTO(?);`;
//     const [results] = await connection.query(query, [idProyecto]);
//     return results[0];
// }

// Corregido
async function listarLineasXIdProyecto(req,res,next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        const lineas = results[0];
        res.status(200).json({lineas, message: "Estimacion costo listado"});
    } catch (error) {
        console.log(error);
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
    listarLineasXNombreFechas,
    listarLineasXIdProyecto,
    eliminarLineaEstimacionCosto
};