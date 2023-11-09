const connection = require("../../config/db");

async function guardarPlantillaAC(req, res, next) {
    const {idActaConstitucion, idUsuario, nombrePlantilla} = req.body;
    const query = `CALL GUARDAR_PLANTILLA_ACTACONSTITUCION(?,?);`;
    const query1 = `CALL LISTAR_NOMBRES_CAMPOS_AC(?);`;
    const query2 = `CALL INSERTAR_PLANTILLA_AC_TIPODATO(?,?);`;
    try {
        //Creamos primero la plantilla en general
        const [results] = await connection.query(query, [idUsuario, nombrePlantilla]);
        const idPlantillaAC = results[0][0].idPlantillaAC;
        console.log(`Se creo la plantilla AC ${idPlantillaAC}!`);
        //Obtenemos los campos que se guardaran en la plantilla
        const [results1] = await connection.query(query1, [idActaConstitucion]);
        let camposAC = results1[0];
        //Ahora los campos obtenidos lo insertamos a la tabla PlantillaACTipoDato
        for(let campoAC of camposAC){
            await connection.query(query2, [idPlantillaAC, campoAC.nombre]);
        }
        res.status(200).json({
            message: `Se insertó la Plantilla Acta Constitucion ${idPlantillaAC} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function listarPlantillasAC(req, res, next) {
    const {idUsuario} = req.params;
    const query = `CALL LISTAR_PLANTILLA_ACTACONSTITUCION(?);`;
    try {
        //Traemos todas las plantillas de Acta de Constitucion del usuario
        const [results] = await connection.query(query, [idUsuario]);
        const plantillasAC = results[0];
        res.status(200).json({
            plantillasAC,
            message: `Se listó las plantilas de Acta de constitucion del ${idUsuario} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarPlantillaAC(req, res, next) {
    const {idPlantillaAC} = req.body;
    const query = `CALL ELIMINAR_PLANTILLA_ACTACONSTITUCION(?);`;
    try {
        //Eliminamos la plantilla poniendo activo a 0
        await connection.query(query, [idPlantillaAC]);
        res.status(200).json({
            message: `Se eliminó la plantilla ${idPlantillaAC} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    guardarPlantillaAC,
    listarPlantillasAC,
    eliminarPlantillaAC
};
