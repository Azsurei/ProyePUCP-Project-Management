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
        presupuesto = results[0];
        
        res.status(200).json({
            presupuesto,
            message: "Presupuesto listado correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function listarLineasTodas(req, res, next) {
    const {idProyecto} = req.params;
    try {
        const lineasIngreso = await ingresoController.funcListarLineasXIdProyecto(idProyecto);
        const lineasEgreso = await egresoController.funcListarLineasXIdProyecto(idProyecto);
        const lineasEstimacionCosto = await estimacionCostoController.funcListarLineasXIdProyecto(idProyecto);

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

async function listarLineasIngresoYEgresoXIdProyecto(req, res, next) {
    const {idProyecto} = req.params;
    try {
        const lineasIngreso = await ingresoController.funcListarLineasXIdProyecto(idProyecto);
        const lineasEgreso = await egresoController.funcListarLineasXIdProyecto(idProyecto);

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




module.exports = {
    crear,
    modificar,
    listarLineasTodas,
    listarXIdPresupuesto,
    listarLineasIngresoYEgresoXIdProyecto
};