const connection = require("../../config/db");

async function listarXIdProyecto(req,res,next){
    const { idProyecto} = req.params;
   
    console.log(`Llegue a recibir solicitud listar backlog con id de Proyecto :  ${idProyecto}`);

    const query = `CALL LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(?);`;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({
            backlog: results[0],
            message: "Backlog obtenido exitosamente"
        });
        console.log(`Se han listado el backlog para el proyecto ${idProyecto}!`);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send("Error al obtener los proyectos: " + error.message);
    }
}

module.exports = {
    listarXIdProyecto
}