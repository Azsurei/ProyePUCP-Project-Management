const connection = require("../../config/db");

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
        const matrizComunicacion = results[0];
        res.status(200).json({matrizComunicacion, message: "Matriz de Comunicacion listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}   
async function insertarMatrizComunicacion(req,res,next){
        const{idCanal, idFrecuencia, idFormato, idMatrizComunicacion, sumillaInformacion, detalleInformacion, 
            responsableDeComunicar, grupoReceptor} = req.body;
        const query = `
            CALL INSERTAR_COMUNICACION_X_IDMATRIZ(?,?,?,?,?,?,?,?);
        `;
        try {
            const [results] = await connection.query(query,[idCanal,idFrecuencia,idFormato,idMatrizComunicacion,
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

module.exports = {
    listarCanales,
    listarFrecuencia,
    listarFormato,
    listarMatrizComunicacion,
    insertarMatrizComunicacion
};
