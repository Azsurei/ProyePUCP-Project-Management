const connection = require("../../config/db");

async function listarXIdEpica(req,res,next){
    const {idEpica} = req.params;
    console.log("Llegue a recibir solicitud listar hu");
    const query = `CALL LISTAR_HISTORIAS_DE_USUARIO_X_ID_EPICA(?);`;
    try {
        const [results] = await connection.query(query,[idEpica]);
        res.status(200).json({
            HUs: results[0],
            message: "Historias de usuario obtenidas exitosamente"
        });
        console.log(`Se han listado las historias de usuario para la epica ${idEpica}!`);
    } catch (error) {
        console.error("Error al obtener las historias de usuario:", error);
        res.status(500).send("Error al obtener las historias de usuario: " + error.message);
    }
}

async function listarXIdProyectoTabla(req,res,next){
    const { idProyecto } = req.params;
    console.log(`Llegué a recibir la solicitud para listar historias del proyecto ${idProyecto}`);
    const query = `
      CALL LISTAR_HISTORIAS_DE_USUARIO_X_ID_PROYECTO_TABLA(?);
    `;
    try {
      const [results] = await connection.query(query, [idProyecto]);
      console.log(results[0]);
      res.status(200).json({
        historias: results[0],
        message: "Historias obtenidas exitosamente"
      });
      console.log(`Se han listado las historias para el proyecto ${idProyecto}!`);
    } catch (error) {
      console.error("Error al obtener las historias:", error);
      res.status(500).send("Error al obtener las historias: " + error.message);
    }
}
module.exports = {
    listarXIdEpica,
    listarXIdProyectoTabla
}