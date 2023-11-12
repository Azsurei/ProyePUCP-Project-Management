const connection = require("../../config/db");

async function insertarGrupoProyectos(req, res, next) {
    const { nombreGrupo, idUsuario, proyectos } = req.body;

    const listProyectos = proyectos.map((proyect) => {
        return parseInt(proyect);
    });

    const query = `CALL INSERTAR_GRUPO_PROYECTO(?,?);`;
    const query1 = `CALL INSERTAR_PROYECTO_EN_GRUPO(?,?);`;
    try {
        const [results] = await connection.query(query,[nombreGrupo, idUsuario]);
        const idGrupoDeProyecto = results[0][0].idGrupoDeProyecto;

        for(let proyecto of listProyectos){
            await connection.query(query1, [proyecto, idGrupoDeProyecto]);
        }
        res.status(200).json({
            message: "Se insertó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}
async function listarGruposProyecto(req,res,next){
    const { idUsuario } = req.params;
    try {
        const query = `CALL LISTAR_GRUPO_PROYECTOS_X_ID_USUARIO(?);`;
        const [results] = await connection.query(query,[idUsuario]);
        const grupos = results[0];
        res.status(200).json({grupos, message: "Grupos listados"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}




async function listarProyectosXGrupo(req, res, next) {
    const { idGrupoProyecto  } = req.params;

    //de presupuesto
    const query = `CALL LISTAR_PROYECTOS_PRESUPUESTO_X_GRUPO_PROYECTOS(?);`;
    const query1 = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`;
    const query2 = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(?);`;      //trae tareas padres absolutas (o sin hijos)

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


//un arreglo de proyectos
//cada proyecto debe tener data de presupuesto
//cada proyecto debe tener data de entregables
//cada proyecto debe tener data de tareas


async function listarDatosProyectosXGrupo(req, res, next) {
    const { idGrupoProyecto  } = req.params;

    //de proyecto
    const query = `CALL LISTAR_PROYECTOS_X_GRUPO_PROYECTOS(?);`;

    //de herramientas
    const queryA1 = `CALL LISTAR_EDT_CRONOGRAMA_PRESUPUESTO_X_ID_PROYECTO(?);`;

    //de presupuesto
    const queryP1 = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`;
    const queryP2 = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(?);`;
    
    //de entregables
    const queryE1 = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`

    try {
        const [results] = await connection.query(query,[idGrupoProyecto]);
        const proyectos = results[0];

        for(const proyecto of proyectos){
            const [resultsB] = await connection.query(queryA1,[proyecto.idProyecto]);
            const idHerramientas = resultsB[0];

            proyecto.EDT.idEDT = idHerramientas.idEDT;
            proyecto.cronograma.idCronograma = idHerramientas.idCronograma;
            proyecto.presupuesto.idPresupuesto = idHerramientas.idPresupuesto;

            //para presupuesto
            const [resultsP1] = await connection.query(queryP1, [proyecto.presupuesto.idPresupuesto]);
            const ingresos = resultsP1[0];
            proyecto.presupuesto.ingresos = ingresos;

            const [resultsP2] = await connection.query(queryP2, [proyecto.presupuesto.idPresupuesto]);
            const egresos = resultsP2[0];
            proyecto.presupuesto.egresos = egresos;


            //para entregables
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
    listarProyectosXGrupo,
    listarDatosProyectosXGrupo
};
