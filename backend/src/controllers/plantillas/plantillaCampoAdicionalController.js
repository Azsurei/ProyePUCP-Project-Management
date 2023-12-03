const connection = require("../../config/db");

async function guardarPlantillaCA(req, res, next) {
    const {idUsuario, nombrePlantilla, titulos} = req.body;
    const query = `CALL GUARDAR_PLANTILLA_CA(?,?);`;
    const query1 = `CALL INSERTAR_CAMPOS_PLANTILLA_CA(?,?);`;
    try {
        //Creamos primero la plantilla en general
        const [results] = await connection.query(query, [idUsuario, nombrePlantilla]);
        const idPlantillaCampoAdicional = results[0][0].idPlantillaCampoAdicional;
        console.log(`Se creo la plantilla Campo Adicional ${idPlantillaCampoAdicional}!`);
        //Ahora los campos lo insertamos a la tabla PlantillaNombreCampos
        for(let titulo of titulos){
            await connection.query(query1, [idPlantillaCampoAdicional, titulo]);
        }
        res.status(200).json({
            message: `Se insertó la Plantilla Campo Adicional ${idPlantillaCampoAdicional} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function listarPlantillasCA(req, res, next) {
    const {idUsuario} = req.params;
    const query = `CALL LISTAR_PLANTILLA_CA(?);`;
    try {
        //Traemos todas las plantillas MR del usuario
        const [results] = await connection.query(query, [idUsuario]);
        const plantillasCA = results[0];
        res.status(200).json({
            plantillasCA,
            message: `Se listó las plantilas CA del ${idUsuario} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function listarPlantillasCAXNombre(req, res, next) {
    const {idUsuario, nombre} = req.params;
    const query = `CALL LISTAR_PLANTILLA_CA_X_NOMBRE(?,?);`;
    try {
        //Traemos todas las plantillas CA del usuario
        const [results] = await connection.query(query, [idUsuario, nombre]);
        const plantillasCA = results[0];
        res.status(200).json({
            plantillasCA,
            message: `Se listó las plantilas CA del ${idUsuario} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarPlantillaCA(req, res, next) {
    const {idPlantillaCampoAdicional} = req.body;
    const query = `CALL ELIMINAR_PLANTILLA_CA(?);`;
    try {
        //Eliminamos la plantilla poniendo activo a 0
        await connection.query(query, [idPlantillaCampoAdicional]);
        res.status(200).json({
            message: `Se eliminó la plantilla ${idPlantillaCampoAdicional} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function seleccionarPlantillaCA(req, res, next) {
    const {idPlantillaCampoAdicional} = req.params;
    const query = `CALL LISTAR_CA_X_ID(?);`;
    try {
        //Traemos todas las plantillas MR del usuario
        const [results] = await connection.query(query, [idPlantillaCampoAdicional]);
        const camposAdicionales = results[0];
        res.status(200).json({
            camposAdicionales,
            message: `Se listó los campos adicioanles exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    guardarPlantillaCA,
    listarPlantillasCA,
    listarPlantillasCAXNombre,
    eliminarPlantillaCA,
    seleccionarPlantillaCA
};