const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPresupuesto,subtotal} = req.body;
    try {
        const query = `CALL INSERTAR_EGRESO(?,?);`;
        await connection.query(query,[idPresupuesto,subtotal]);
        res.status(200).json({message: "Egreso creado"});
    } catch (error) {
        next(error);
    }
}

async function crearLineaEgreso(req,res,next){
    const {idPresupuesto,idMoneda,idLineaEstimacionCosto,descripcion,costoReal,fechaRegistro,cantidad} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_EGRESO(?,?,?,?,?,?,?);`;
        const [results] =await connection.query(query,[idPresupuesto,idMoneda,idLineaEstimacionCosto,descripcion,costoReal,fechaRegistro,cantidad]);
        idLineaEgreso = results[0][0].idLineaEgreso;
        res.status(200).json({
            idLineaEgreso,
            message: "Linea egreso creada"});
    } catch (error) {
        next(error);
    }
}

// Definir una función para obtener líneas de egreso
async function funcListarLineasXIdPresupuesto(idPresupuesto) {
    let lineasEgreso = [];
    try {
        const query = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query, [idPresupuesto]);
        lineasEgreso = results[0];
    } catch (error) {
        console.log(error);
    }
    return lineasEgreso;
}

async function listarLineasXIdPresupuesto(req,res,next) {
    const { idPresupuesto } = req.params;
    try {
        const lineasEgreso = await funcListarLineasXIdPresupuesto(idPresupuesto);
        res.status(200).json({lineasEgreso, message: "Lineas de egreso listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Definir una función para modificar líneas de egreso
async function modificarLineaEgreso(req,res,next) {
    const {idLineaEgreso,idMoneda,idLineaEstimacionCosto,descripcion,costoReal,fechaRegistro,cantidad} = req.body;
    const query = `CALL MODIFICAR_LINEA_EGRESO(?,?,?,?,?,?,?);`;
    try {
        
        const [results] = await connection.query(query, [idLineaEgreso,idMoneda,idLineaEstimacionCosto,descripcion,costoReal,fechaRegistro,cantidad]);
        const idLineaEgresoModificado = results[0][0].idLineaEgreso;
        res.status(200).json({idLineaEgresoModificado, message: "Lineas de egreso modificadas"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}



async function listarLineasXNombreFechas(req,res,next){
    const {idPresupuesto,descripcion,fechaIni,fechaFin} = req.params;

    const processeddescripcion = descripcion !== 'NULL' ? descripcion : null;
    const processedfechaIni = fechaIni !== 'NULL' ? fechaIni : null;
    const processedfechaFin = fechaFin !== 'NULL' ? fechaFin : null;
    try {
        const query = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(?,?,?,?);`;
        const [resultsLineasEgreso] = await connection.query(query,[idPresupuesto,processeddescripcion,processedfechaIni,processedfechaFin]);
        lineasEgreso = resultsLineasEgreso[0];
        
        res.status(200).json({
            lineasEgreso,
            message: "Lineas de egreso listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}


async function eliminarLineaEgreso(req,res,next){
    const {idLineaEgreso} = req.body;
    try {
        const query = `CALL ELIMINAR_LINEA_EGRESO(?);`;
        await connection.query(query,[idLineaEgreso]);
        res.status(200).json({message: "Linea egreso eliminada"});
    } catch (error) {
        next(error);
    }
}

async function funcListarLineasFlujoCajaXIdPresupuesto(idPresupuesto,fechaIni,fechaFin){
    let lineasEgreso = [];
    try {
        const query = `CALL LISTAR_LINEA_EGRESO_FC_X_ID_PRESUPUESTO_FECHAS(?,?,?);`;
        const [results] = await connection.query(query, [idPresupuesto,fechaIni,fechaFin]);
        lineasEgreso = results[0];
        return lineasEgreso;
    } catch (error) {
        console.log(error);
    }
}

async function ordenarLineasEgreso(lineasEgreso,mesActual,mesesMostrados){
    const totalEgresosPorMes = Array.from({ length: mesesMostrados.length }, () => 0);

    try {
        lineasEgreso.forEach((egreso) => {
            const fechaGasto = new Date(egreso.fechaRegistro);
            const mesReal = fechaGasto.getUTCMonth() + 1 - mesActual + 1;
            const montoReal = parseFloat(egreso.costoReal);
    
            /*if (mesReal >= 1 && mesReal <= mesesMostrados.length) {
            totalEgresosPorMes[mesReal - 1] += MonedaPresupuesto === egreso.idMoneda
            ? egreso.costoReal
            : convertirTarifa(egreso.costoReal, egreso.idMoneda);;
            }*/
            if (mesReal >= 1 && mesReal <= mesesMostrados.length) {
                totalEgresosPorMes[mesReal - 1] += egreso.costoReal;
            }
        });
    } catch (error) {
        console.log(error);
    }

  return totalEgresosPorMes;
}


module.exports = {
    crear,
    crearLineaEgreso,
    modificarLineaEgreso,
    listarLineasXNombreFechas,
    listarLineasXIdPresupuesto,
    eliminarLineaEgreso,
    funcListarLineasXIdPresupuesto,
    funcListarLineasFlujoCajaXIdPresupuesto,
    ordenarLineasEgreso
};