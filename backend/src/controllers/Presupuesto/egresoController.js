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
    const {idEgreso,idMoneda,descripcion,costoReal,fechaRegistro,cantidad} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_EGRESO(?,?,?,?,?,?);`;
        await connection.query(query,[idEgreso,idMoneda,descripcion,costoReal,fechaRegistro,cantidad]);
        res.status(200).json({message: "Linea egreso creada"});
    } catch (error) {
        next(error);
    }
}

async function listarLineasXNombreFechas(req,res,next){
    const {idProyecto,descripcion,fechaIni,fechaFin} = req.params;

    const processeddescripcion = descripcion !== 'NULL' ? descripcion : null;
    const processedfechaIni = fechaIni !== 'NULL' ? fechaIni : null;
    const processedfechaFin = fechaFin !== 'NULL' ? fechaFin : null;
    try {
        const query = `CALL LISTAR_LINEA_EGRESO_X_ID_PROYECTO_NOMBRE_FECHAS(?,?,?,?);`;
        const [resultsLineasEgreso] = await connection.query(query,[idProyecto,processeddescripcion,processedfechaIni,processedfechaFin]);
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

module.exports = {
    crear,
    crearLineaEgreso,
    listarLineasXNombreFechas,
    eliminarLineaEgreso
};