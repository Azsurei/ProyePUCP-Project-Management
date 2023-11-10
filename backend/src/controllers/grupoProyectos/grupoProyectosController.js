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

async function listarProyectosXGrupo(req, res, next) {
    const { idGrupoProyecto  } = req.params;
    const query = `CALL LISTAR_PROYECTOS_PRESUPUESTO_X_GRUPO_PROYECTOS(?);`;
    const query1 = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`;
    const query2 = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(?);`;
    try {
        const [results] = await connection.query(query,[idGrupoProyecto]);
        const proyectos = results[0];
        for(let proyecto of proyectos){
            const [results1] = await connection.query(query1, [proyecto.idPresupuesto]);
            let ingresos = results1[0];
            proyecto.ingresos = ingresos;
            const [results2] = await connection.query(query2, [proyecto.idPresupuesto]);
            let egresos = results2[0];
            proyecto.egresos = egresos;
        }
        res.status(200).json({
            proyectos,
            message: "Se listó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    insertarGrupoProyectos,
    listarGruposProyecto,
    listarProyectosXGrupo
};
