const connection = require("../../config/db");

async function eliminar(idMatrizComunicacion){
    //const { idMatrizComunicacion } = req.body;
    console.log(`Procediendo: Eliminar/MatrizComunicacion ${idMatrizComunicacion}...`);
    try {
        const result = await funcEliminar(idMatrizComunicacion);
        // res.status(200).json({
        //     idMatrizComunicacion,
        //     message: "MatrizComunicacion eliminado"});
        console.log(`MatrizComunicacion ${idMatrizComunicacion} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/MatrizComunicacion", error);
    }
}

async function funcEliminar(idProductBacklog) {
    try {
        const query = `CALL ELIMINAR_MATRIZ_COMUNICACIONES_X_ID_MATRIZ_C(?);`;
        [results] = await connection.query(query,[idProductBacklog]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/MatrizComunicacion", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/MatrizComunicacion del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`MatrizComunicacion del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/MatrizComunicacion X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_MATRIZ_COMUNICACIONES_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/MatrizComunicacion X Proyecto", error);
        return 0;
    }
    return 1;
}

async function listarCanales(req,res,next){
    try {
        const query = `CALL LISTAR_COMUNICACION_CANAL;`;
        const [results] = await connection.query(query);
        const canales = results[0];
        res.status(200).json({canales, message: "Canales listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarFrecuencia(req,res,next){
    try {
        const query = `CALL LISTAR_COMUNICACION_FRECUENCIA;`;
        const [results] = await connection.query(query);
        const frecuencias = results[0];
        res.status(200).json({frecuencias, message: "Frecuencias listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarFormato(req,res,next){
    try {
        const query = `CALL LISTAR_COMUNICACION_FORMATO;`;
        const [results] = await connection.query(query);
        const formatos = results[0];
        res.status(200).json({formatos, message: "Formatos listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarMatrizComunicacion(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_MATRIZCOMUNICACIONES_X_IDPROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        matrizComunicacion = results[0];
        res.status(200).json({matrizComunicacion, message: "Matriz de Comunicacion listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}   
async function insertarMatrizComunicacion(req,res,next){
        const{idProyecto, idCanal, idFrecuencia, idFormato, sumillaInformacion, detalleInformacion, 
            responsableDeComunicar, grupoReceptor} = req.body;
        const query = `
            CALL INSERTAR_COMUNICACION_X_IDPROYECTO(?,?,?,?,?,?,?,?);
        `;
        try {
            const [results] = await connection.query(query,[idProyecto, idCanal,idFrecuencia,idFormato,
                sumillaInformacion,detalleInformacion,responsableDeComunicar,grupoReceptor]);
            const idComunicacion = results[0][0].idComunicacion;
            console.log(`Se insertó la comunicacion ${idComunicacion}!`);
            res.status(200).json({
                idComunicacion,
                message: "Comunicacion insertada exitosamente",
            });
        } catch (error) {
            next(error);
        }
}

async function modificarMatrizComunicacion(req,res,next){
    const{idComunicacion, idCanal, idFrecuencia, idFormato, sumillaInformacion, detalleInformacion, 
        responsableDeComunicar, grupoReceptor} = req.body;
    const query = `
        CALL MODIFICAR_COMUNICACION(?,?,?,?,?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idComunicacion, idCanal,idFrecuencia,idFormato,
            sumillaInformacion,detalleInformacion,responsableDeComunicar,grupoReceptor]);
        const id_comunicacion = results[0][0].idComunicacion;
        console.log(`Se modificó la comunicacion ${id_comunicacion}!`);
        res.status(200).json({
            id_comunicacion,
            message: "Comunicacion modificada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}
async function listarComunicacion(req,res,next){
    const {idComunicacion} = req.params;
    try {
        const query = `CALL LISTAR_COMUNICACION_X_IDCOMUNICACION(?);`;
        const [results] = await connection.query(query,[idComunicacion]);
        comunicacion = results[0];
        res.status(200).json({comunicacion, message: "Comunicacion listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
} 
async function eliminarComunicacion(req,res,next){
    const {idComunicacion} = req.body;
    const query = `CALL ELIMINAR_COMUNICACION(?);`;
    try {
        const [results] = await connection.query(query,[idComunicacion]);
        const id_comunicacion = results[0][0].idComunicacion;
        console.log(`Se eliminó la comunicacion ${id_comunicacion}!`);
        res.status(200).json({
            id_comunicacion,
            message: "Comunicacion modificada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}  

module.exports = {
    eliminar,
    eliminarXProyecto,
    listarCanales,
    listarFrecuencia,
    listarFormato,
    listarMatrizComunicacion,
    insertarMatrizComunicacion,
    modificarMatrizComunicacion,
    listarComunicacion,
    eliminarComunicacion
};
