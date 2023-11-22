const connection = require("../../config/db");

const monedaController = require("./monedaController");

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
    const {idPresupuesto,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_INGRESO(?,?,?,?,?,?,?,?);`;
        const [result] =await connection.query(query,[idPresupuesto,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion]);
        console.log(result[0][0].idLineaIngreso);
        res.status(200).json({message: "Linea ingreso creada"});
    } catch (error) {
        next(error);
    }
}

async function modificarLineaIngreso(req,res,next){
    const {idLineaIngreso,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion} = req.body;
    const query = `CALL MODIFICAR_LINEA_INGRESO(?,?,?,?,?,?,?,?);`;
    try {
        
        const [results] =await connection.query(query,[idLineaIngreso,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion]);
        const idModificado = results[0][0].idLineaIngreso;
        console.log(`Se modificó la linea de ingreso ${idModificado}!`);
        res.status(200).json({message: "Linea ingreso modificada"});
    } catch (error) {
        next(error);
    }
}

// Definir una función para obtener líneas de ingreso
async function funcListarLineasXIdPresupuesto(idPresupuesto){
    let lineasIngreso = [];
    try{
        const query = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`;
        const [results] = await connection.query(query, [idPresupuesto]);
        lineasIngreso = results[0];
    }catch(error){
        console.log(error);
    }
    return lineasIngreso;
}


// Definir una función para obtener líneas de ingreso
async function listarLineasXIdPresupuesto(req,res,next){
    const { idPresupuesto } = req.params;
    try{
        lineasIngreso = await funcListarLineasXIdPresupuesto(idPresupuesto);
        res.status(200).json({
            lineasIngreso,
            message: "Linea de ingreso listadas correctamente"
        });
    }catch(error){
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
        const query = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(?,?,?,?);`;
        const [resultsLineasIngreso] = await connection.query(query,[idPresupuesto,processeddescripcion,processedfechaIni,processedfechaFin]);
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

async function funcListarLineasFlujoCajaXIdPresupuesto(idPresupuesto,fechaIni,fechaFin){
    let lineasIngreso = [];
    try{
        const query = `CALL LISTAR_LINEA_INGRESO_FC_X_ID_PRESUPUESTO_FECHAS(?,?,?);`;
        const [results] = await connection.query(query, [idPresupuesto,fechaIni,fechaFin]);
        lineasIngreso = results[0];
    }catch(error){
        console.log(error);
    }
    return lineasIngreso;

}

async function ordenarLineasIngreso(lineasIngreso, mesActual, cantidadMeses,idMoneda,monedas) {
    const ingresosPorTipo = [];

    // Inicializa los arrays para cada tipo de ingreso (1-4).
    for (let i = 0; i < 4; i++) {
        ingresosPorTipo[i] = new Array(cantidadMeses).fill(0);
    }

    try {
        lineasIngreso.forEach((row) => {
            const fechaCreacion = new Date(row.fechaTransaccion);
            const mesTransaccion = fechaCreacion.getUTCMonth() + 1; // Los meses en JavaScript empiezan en 0
            const mesReal = mesTransaccion - mesActual; // Ajusta según el mes actual
            const idTipo = row.idIngresoTipo - 1; // Ajustar para índice base 0

            // Asegúrate de que idTipo esté en el rango de 0 a 3 (para tipos de ingreso 1-4).
            // Asegúrate de que el mesReal esté dentro del rango de la matriz.
            if (idTipo >= 0 && idTipo < 4 && mesReal >= 0 && mesReal < cantidadMeses) {
                // Convierte el monto a la moneda del presupuesto
                if(row.idMoneda !== idMoneda){
                    const cambioMoneda = monedas[row.idMoneda-1].tipoCambio;
                    row.monto = row.monto * cambioMoneda;
                }
                ingresosPorTipo[idTipo][mesReal] += row.monto;
            }
        });
    } catch (error) {
        console.error(error);
    }

    // No necesitamos mapear a través de ingresosPorTipo ya que todos los sub-arrays ya tienen la misma longitud
    return ingresosPorTipo;
}

module.exports = {
    crear,
    crearLineaIngreso,
    modificarLineaIngreso,
    listarLineasXNombreFechas,
    eliminarLineaIngreso,
    listarLineasXIdPresupuesto,
    funcListarLineasXIdPresupuesto,
    funcListarLineasFlujoCajaXIdPresupuesto,
    ordenarLineasIngreso    
};