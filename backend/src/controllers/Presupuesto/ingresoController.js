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
    const {idIngreso,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_INGRESO(?,?,?,?,?,?,?,?);`;
        await connection.query(query,[idIngreso,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion]);
        res.status(200).json({message: "Linea ingreso creada"});
    } catch (error) {
        next(error);
    }
}

async function eliminarLineaIngreso(req,res,next){
    const {idLineaIngreso} = req.body;
    try {
        const query = `CALL ELIMINAR_LINEA_INGRESO(?);`;
        await connection.query(query,[idLineaIngreso]);
        res.status(200).json({message: "Linea ingreso eliminada"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    crearLineaIngreso,
    eliminarLineaIngreso
};