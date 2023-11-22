const connection = require("../../config/db");
const ingresoController = require("./ingresoController");
const egresoController = require("./egresoController");
const estimacionCostoController = require("./estimacionCostoController");

async function crear(req,res,next){
    const {idProyecto,idMoneda,presupuestoInicial,cantidadMeses,reservaContingencia,porcentajeReservaGestion,porcentajeGanancia,IGV} = req.body;
    try {
        const idPresupuesto = await funcCrear(idProyecto,idMoneda,presupuestoInicial,cantidadMeses,reservaContingencia,porcentajeReservaGestion,porcentajeGanancia,IGV);
        res.status(200).json({message: "Presupuesto creada"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idProyecto,idMoneda,presupuestoInicial,cantidadMeses,reservaContingencia,porcentajeReservaGestion,porcentajeGanancia,IGV){
    try {
        const query = `CALL INSERTAR_PRESUPUESTO(?,?,?,?,?,?,?,?);`;
        //Modificar para soporter los cambios del reporte de estimaciones
        //Los campos agregados se inicializaran en 0
        const [results]=await connection.query(query,[idProyecto,idMoneda,presupuestoInicial,cantidadMeses,reservaContingencia,porcentajeReservaGestion,porcentajeGanancia,IGV]);
        console.log("Presupuesto creado");
        return results[0][0].idPresupuesto;
    } catch (error) {
        console.log(error);
    }
}

async function modificar(req,res,next){
    const {idMoneda,presupuestoInicial,cantidadMeses,idPresupuesto} = req.body;
    try {
        //Modificar para soporter los cambios del reporte de estimaciones
        //agregar los cambios en la bd y en el query
        const query = `CALL MODIFICAR_PRESUPUESTO(?,?,?,?);`;
        await connection.query(query,[idMoneda,presupuestoInicial,cantidadMeses,idPresupuesto]);
        res.status(200).json({message: "Presupuesto modificado"});
    } catch (error) {
        next(error);
    }
}

//Esto incluye la reserva de contingencia y el IGV
async function modificarPorcentajes(req,res,next){
    const {idPresupuesto,reservaContingencia,porcentajeReservaGestion,porcentajeGanancia,IGV} = req.body;
    try {
        //Modificar para soporter los cambios del reporte de estimaciones
        //agregar los cambios en la bd y en el query
        const query = `CALL MODIFICAR_PORCENTAJES_PRESUPUESTO(?,?,?,?,?);`;
        await connection.query(query,[idPresupuesto,reservaContingencia,porcentajeReservaGestion,porcentajeGanancia,IGV]);
        console.log(`Porcentajes, IGV y reserva del presupuesto ${idPresupuesto}modificado`);
        res.status(200).json({message: "Presupuesto modificado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdPresupuesto(req,res,next){
    const {idPresupuesto} = req.params;
    try {
        const presupuesto = await funcListarXIdPresupuesto(idPresupuesto);
        
        res.status(200).json({
            presupuesto,
            message: "Presupuesto listado correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function funcListarXIdPresupuesto(idPresupuesto){
    let presupuesto = [];
    try {
        const query = `CALL LISTAR_PRESUPUESTO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query,[idPresupuesto]);
        presupuesto = results[0][0];
    } catch (error) {
        console.log(error);
    }
    return presupuesto;
}

async function obtenerPresupuestoFlujoCaja(idPresupuesto,fechaIni,fechaFin){
    try {
        const general = await funcListarXIdPresupuesto(idPresupuesto);
        
        const lineasIngreso = await ingresoController.funcListarLineasFlujoCajaXIdPresupuesto(idPresupuesto,fechaIni,fechaFin);
        
        const lineasEgreso = await egresoController.funcListarLineasFlujoCajaXIdPresupuesto(idPresupuesto,fechaIni,fechaFin);
    
        const presupuesto = {
            general,
            lineasIngreso,
            lineasEgreso
        };
        return presupuesto;
    } catch (error) {
        console.log(error);
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
        const reporte = await funcObtenerPresupuesto(idPresupuesto);
        res.status(200).json({
            reporte,
            message: "Presupuesto obtenido correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function funcObtenerPresupuesto(idPresupuesto){
    try {
        const query = `CALL OBTENER_PRESUPUESTO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query,[idPresupuesto]);
        const presupuesto = results[0][0];
        return presupuesto;
    } catch (error) {
        console.log(error);
    }
}

async function eliminar(idPresupuesto){
    //const { idPresupuesto } = req.body;
    console.log(`Procediendo: Eliminar/Presupuesto ${idPresupuesto}...`);
    try {
        const result = await funcEliminar(idPresupuesto);
        // res.status(200).json({
        //     message: "Presupuesto eliminado"});
        console.log(`Presupuesto ${idPresupuesto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Presupuesto", error);
    }
}

async function funcEliminar(idPresupuesto) {
    try {
        const query = `CALL ELIMINAR_PRESUPUESTO_X_ID_PRESUPUESTO(?);`;
        [results] = await connection.query(query,[idPresupuesto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Presupuesto", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/Presupuesto del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`Presupuesto del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Presupuesto X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_PRESUPUESTO_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Presupuesto X Proyecto", error);
        return 0;
    }
    return 1;
}



module.exports = {
    crear,
    funcCrear,
    modificar,
    modificarPorcentajes,
    listarLineasTodas,
    listarXIdPresupuesto,
    funcListarXIdPresupuesto,
    listarLineasIngresoYEgresoXIdPresupuesto,
    obtenerPresupuesto,
    obtenerPresupuestoFlujoCaja,
    eliminar,
    eliminarXProyecto
};