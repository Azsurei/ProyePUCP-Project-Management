const connection = require("../../config/db");

async function guardarPlantillaKanban(req, res, next) {
    const {idProyecto, idUsuario, nombrePlantilla} = req.body;
    console.log(idProyecto, idUsuario, nombrePlantilla);
    const query = `CALL GUARDAR_PLANTILLA_KANBAN(?,?);`;
    const query1 = `CALL LISTAR_CAMPOS_PLANTILLA_KANBAN(?);`;
    const query2 = `CALL INSERTAR_PLANTILLA_KANBAN_CAMPO(?,?,?);`;
    try {
        //Creamos primero la plantilla en general
        const [results] = await connection.query(query, [idUsuario, nombrePlantilla]);
        const idPlantillaKanban = results[0][0].idPlantillaKanban;
        console.log(`Se creo la plantilla Kanban ${idPlantillaKanban}!`);
        //Obtenemos los campos que se guardaran en la plantilla
        const [results1] = await connection.query(query1, [idProyecto]);
        let camposKanban = results1[0];
        //Ahora los campos obtenidos lo insertamos a la tabla PlantillaACTipoDato
        for(let campoKanban of camposKanban){
            await connection.query(query2, [idPlantillaKanban, campoKanban.nombre, campoKanban.posicion]);
        }
        res.status(200).json({
            message: `Se insertó la Plantilla Kanban ${idPlantillaKanban} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function listarPlantillasKanban(req, res, next) {
    const {idUsuario} = req.params;
    const query = `CALL LISTAR_PLANTILLA_KANBAN(?);`;
    try {
        //Traemos todas las plantillas de Kanban del usuario
        const [results] = await connection.query(query, [idUsuario]);
        const plantillasKanban = results[0];
        res.status(200).json({
            plantillasKanban,
            message: `Se listó las plantilas de Kanban del ${idUsuario} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarPlantillaKanban(req, res, next) {
    const {idPlantillaKanban} = req.body;
    const query = `CALL ELIMINAR_PLANTILLA_KANBAN(?);`;
    try {
        //Eliminamos la plantilla poniendo activo a 0
        await connection.query(query, [idPlantillaKanban]);
        res.status(200).json({
            message: `Se eliminó la plantilla ${idPlantillaKanban} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

async function seleccionarPlantillaKanban(req, res, next) {
    const {idProyecto,idPlantillaKanban} = req.body;
    const query = `CALL LIMPIAR_KANBAN_PLANTILLA_KANBAN(?);`;
    const query1 = `CALL LISTAR_CAMPOS_PLANTILLA_KANBAN_X_IDPLANTILLA(?);`;
    const query2 = `CALL INSERTAR_CAMPOS_PLANTILLA_KANBAN(?,?,?);`;
    try {
        //Primero eliminamos todos los campos de la actual plantilla de Kanban
        await connection.query(query, [idProyecto]);
        //Listamos los nuevos campos
        const [results1] = await connection.query(query1, [idPlantillaKanban]);
        let camposKanban = results1[0];
        //Insertamos los nuevos campos al Kanban
        for(let campoKanban of camposKanban){
            await connection.query(query2, [idProyecto, campoKanban.nombre, campoKanban.posicion]);
        }
        res.status(200).json({
            message: `Se activó la plantilla ${idPlantillaKanban} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    guardarPlantillaKanban,
    listarPlantillasKanban,
    eliminarPlantillaKanban,
    seleccionarPlantillaKanban
};
