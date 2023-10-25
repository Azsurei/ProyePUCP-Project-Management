const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPresupuesto,subtotal} = req.body;
    try {
        const query = `CALL INSERTAR_INGRESO(?,?);`;
        await connection.query(query,[idPresupuesto,subtotal]);
        res.status(200).json({message: "Ingreso creado"});
    } catch (error) {
        next(error);
    }
}

async function crearLineaIngreso(req,res,next){
    const {idPresupuesto,idProyecto,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_INGRESO(?,?,?,?,?,?,?,?,?);`;
        const [result] =await connection.query(query,[idPresupuesto,idProyecto,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion]);
        console.log(result[0][0].idLineaIngreso);
        res.status(200).json({message: "Linea ingreso creada"});
    } catch (error) {
        next(error);
    }
}

async function modificarLineaIngreso(req,res,next){
    const {idLineaIngreso,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion} = req.body;
    try {
        const query = `CALL MODIFICAR_LINEA_INGRESO(?,?,?,?,?,?,?,?);`;
        const [results] =await connection.query(query,[idLineaIngreso,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion]);
        idModificado = results[0][0].idLineaIngreso;
        res.status(200).json({message: "Linea ingreso modificada"});
    } catch (error) {
        next(error);
    }
}


// Definir una función para obtener líneas de ingreso
async function listarLineasXIdProyecto(req,res,next){
    const { idProyecto } = req.params;
    const query = `CALL LISTAR_LINEA_INGRESO_X_ID_PROYECTO(?);`;
    const [results] = await connection.query(query, [idProyecto]);
    lineasIngreso = results[0];
    res.status(200).json({
        lineasIngreso,
        message: "Linea de ingreso listadas correctamente"
    });
}


async function listarLineasXNombreFechas(req,res,next){
    const {idProyecto,descripcion,fechaIni,fechaFin} = req.params;

    const processeddescripcion = descripcion !== 'NULL' ? descripcion : null;
    const processedfechaIni = fechaIni !== 'NULL' ? fechaIni : null;
    const processedfechaFin = fechaFin !== 'NULL' ? fechaFin : null;

    try {
        const query = `CALL LISTAR_LINEA_INGRESO_X_ID_PROYECTO_NOMBRE_FECHAS(?,?,?,?);`;
        const [resultsLineasIngreso] = await connection.query(query,[idProyecto,processeddescripcion,processedfechaIni,processedfechaFin]);
        lineasIngreso = resultsLineasIngreso[0];
        
        res.status(200).json({
            lineasIngreso,
            message: "Linea de ingreso listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarLineaIngreso(req,res,next){
    const {idLineaIngreso} = req.body;
    try {
        const query = `CALL ELIMINAR_LINEA_INGRESO(?);`;
        await connection.query(query,[idLineaIngreso]);
        console.log(`Se eliminó la comunicacion ${idLineaIngreso}!`);
        res.status(200).json({message: "Linea ingreso eliminada"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    crearLineaIngreso,
    modificarLineaIngreso,
    listarLineasXNombreFechas,
    eliminarLineaIngreso,
    listarLineasXIdProyecto
};