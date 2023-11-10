const connection = require("../../config/db");

async function insertarGrupoProyectos(req, res, next) {
    const { nombreGrupo, proyectos } = req.body;
    const query = `CALL INSERTAR_GRUPO_PROYECTO(?);`;
    const query1 = `CALL INSERTAR_GRUPO_EN_PROYECTO(?,?);`;
    try {
        const [results] = await connection.query(query,[nombreGrupo]);
        const idGrupoDeProyecto = results[0][0].idGrupoDeProyecto;
        for(let proyecto of proyectos){
            await connection.query(query1, [proyecto.idProyecto, idGrupoDeProyecto]);
        }
        res.status(200).json({
            message: "Se insertó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    insertarGrupoProyectos
};
