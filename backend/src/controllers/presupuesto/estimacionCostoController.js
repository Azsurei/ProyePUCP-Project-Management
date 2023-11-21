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
    const {idMoneda,idPresupuesto,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio,tiempoRequerido} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_ESTIMACION_COSTO(?,?,?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idMoneda,idPresupuesto,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio,tiempoRequerido]);
        idLineaEstimacionCosto=results[0][0].idLineaEstimacionCosto;
        res.status(200).json({
            idLineaEstimacionCosto,
            message: "Linea  estimacion costo creada"});
    } catch (error) {
        next(error);
    }
}

async function modificarLineaEstimacionCosto(req,res,next){
    const {idLineaEstimacionCosto,idMoneda,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio,tiempoRequerido} = req.body;
    try {
        const query = `CALL MODIFICAR_LINEA_ESTIMACION_COSTO(?,?,?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idLineaEstimacionCosto,idMoneda,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio,tiempoRequerido]);
        idModificado = results[0][0].idLineaEstimacionCosto;
        res.status(200).json({message: "Linea estimacion costo modificada"});
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
    const {idPresupuesto,descripcion,fechaIni,fechaFin} = req.params;
    const processeddescripcion = descripcion !== 'NULL' ? descripcion : null;
    const processedfechaIni = fechaIni !== 'NULL' ? fechaIni : null;
    const processedfechaFin = fechaFin !== 'NULL' ? fechaFin : null;

    try {
        const query = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(?,?,?,?);`;
        const [resultsLineasEstimacionCosto] = await connection.query(query,[idPresupuesto,processeddescripcion,processedfechaIni,processedfechaFin]);
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

async function funcListarLineasXIdPresupuesto(idPresupuesto) {
    let lineasEstimacionCosto = [];
    try {
        const query = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query, [idPresupuesto]);
        lineasEstimacionCosto = results[0];
    } catch (error) {
        console.log(error);
    }
    return lineasEstimacionCosto;
}

async function listarLineasXIdPresupuesto(req,res,next) {
    const { idPresupuesto } = req.params;
    try {
        const lineasEstimacionCosto = await funcListarLineasXIdPresupuesto(idPresupuesto);
        res.status(200).json({lineasEstimacionCosto, message: "Estimacion costo listado"});
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

async function funcListarLineasFlujoCajaXIdPresupuesto(idPresupuesto,fechaIni,fechaFin){
    try{
        const query = `CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO_FECHAS(?,?,?);`;
        const [results] = await connection.query(query,[idPresupuesto,fechaIni,fechaFin]);
        return results[0];
    }catch(error){
        console.log(error);
    }
}
module.exports = {
    crear,
    crearLineaEstimacionCosto,
    modificarLineaEstimacionCosto,
    listarLineasXNombreFechas,
    listarLineasXIdPresupuesto,
    eliminarLineaEstimacionCosto,
    funcListarLineasXIdPresupuesto,
    funcListarLineasFlujoCajaXIdPresupuesto
};