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
async function listarGruposProyecto(req,res,next){
    try {
        const query = `CALL LISTAR_GRUPO_PROYECTOS;`;
        const [results] = await connection.query(query);
        const grupos = results[0];
        res.status(200).json({grupos, message: "Grupos listados"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports = {
    insertarGrupoProyectos,
    listarGruposProyecto
    
};
