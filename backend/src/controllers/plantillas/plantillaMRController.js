const connection = require("../../config/db");

async function guardarPlantillaMR(req, res, next) {
    const {idMatrizResponsabilidad, idUsuario, nombrePlantilla} = req.body;
    const query = `CALL GUARDAR_PLANTILLA_MR(?,?);`;
    const query1 = `CALL LISTAR_CAMPOS_MR(?);`;
    const query2 = `CALL INSERTAR_PLANTILLA_MR_CAMPOS(?,?,?,?,?);`;
    try {
        //Creamos primero la plantilla en general
        const [results] = await connection.query(query, [idUsuario, nombrePlantilla]);
        const idPlantillaMR = results[0][0].idPlantillaMR;
        console.log(`Se creo la plantilla MR ${idPlantillaMR}!`);
        //Obtenemos los campos que se guardaran en la plantilla
        const [results1] = await connection.query(query1, [idMatrizResponsabilidad]);
        let camposMR = results1[0];
        //Ahora los campos obtenidos lo insertamos a la tabla PlantillaACTipoDato
        for(let campoMR of camposMR){
            await connection.query(query2, [idPlantillaMR, campoMR.letraRol, campoMR.nombreRol, campoMR.colorRol, campoMR.descripcionRol]);
        }
        res.status(200).json({
            message: `Se insertó la Plantilla MR ${idPlantillaMR} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    guardarPlantillaMR
};