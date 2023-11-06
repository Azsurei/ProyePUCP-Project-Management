const connection = require("../../config/db");
const ingresoController = require("./ingresoController");
const egresoController = require("./egresoController");
const estimacionCostoController = require("./estimacionCostoController");

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

async function modificar(req,res,next){
    const {idMoneda,presupuestoInicial,cantidadMeses,idPresupuesto} = req.body;
    try {
        const query = `CALL MODIFICAR_PRESUPUESTO(?,?,?,?);`;
        await connection.query(query,[idMoneda,presupuestoInicial,cantidadMeses,idPresupuesto]);
        res.status(200).json({message: "Presupuesto modificado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdPresupuesto(req,res,next){
    const {idPresupuesto} = req.params;
    try {
        const query = `CALL LISTAR_PRESUPUESTO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query,[idPresupuesto]);
        const presupuesto = results[0];
        
        res.status(200).json({
            presupuesto,
            message: "Presupuesto listado correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function listarLineasTodas(req, res, next) {
    const {idPresupuesto} = req.params;
    try {
        const lineasIngreso = await ingresoController.funcListarLineasXIdPresupuesto(idPresupuesto);
        const lineasEgreso = await egresoController.funcListarLineasXIdPresupuesto(idPresupuesto);
        const lineasEstimacionCosto = await estimacionCostoController.funcListarLineasXIdPresupuesto(idPresupuesto);

        const lineasPresupuesto = {
            lineasIngreso,
            lineasEgreso,
            lineasEstimacionCosto
        };

        res.status(200).json({
            lineasPresupuesto,
            message: "Líneas del presupuesto listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}
    
async function listarLineasIngresoYEgresoXIdPresupuesto(req, res, next) {
    const {idPresupuesto} = req.params;
    try {
        const lineasIngreso = await ingresoController.funcListarLineasXIdPresupuesto(idPresupuesto);
        const lineasEgreso = await egresoController.funcListarLineasXIdPresupuesto(idPresupuesto);

        const lineas= {
            lineasIngreso,
            lineasEgreso
        };

        res.status(200).json({
            lineas,
            message: "Líneas egreso e ingreso listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function obtenerPresupuesto(req,res,next){
    const {idPresupuesto} = req.params;
    try {
        const query = `CALL OBTENER_PRESUPUESTO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query,[idPresupuesto]);
        const reporte = results[0];
        res.status(200).json({
            reporte,
            message: "Presupuesto obtenido correctamente"
        });
    } catch (error) {
        next(error);
    }
}




module.exports = {
    crear,
    modificar,
    listarLineasTodas,
    listarXIdPresupuesto,
    listarLineasIngresoYEgresoXIdPresupuesto,
    obtenerPresupuesto
};