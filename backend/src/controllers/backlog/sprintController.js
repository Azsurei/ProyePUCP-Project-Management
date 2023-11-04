const connection = require("../../config/db");
const tareaController = require("../cronograma/tareaController");

async function crear(req,res,next){
    const {idProductBacklog,descripcion,fechaInicio,fechaFin,estado,nombre} = req.body;
    try {
        const query = `CALL INSERTAR_SPRINT(?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idProductBacklog,descripcion,fechaInicio,fechaFin,estado,nombre]);
        const idSprint = results[0][0].idSprint;
        console.log(`Sprint ${idSprint} creado`);
        res.status(200).json({idSprint, message: "Sprint creado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarSprintsXIdBacklog(req,res,next){
    const {idBacklog} = req.params;
    
    try {
        const sprints = await funcListarSprintsXIdBacklog(idBacklog);
        sprints.sinSprint=[];
        for(const sprint of sprints){
            const tareaAux = await tareaController.funcListarTareasXIdSprint(sprint.idSprint);
        }
        console.log(`Sprints listados por id de backlog ${idBacklog}`)
        res.status(200).json({sprints, message: "Sprints listados"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function funcListarSprintsXIdBacklog(idBacklog){
    const query = `CALL LISTAR_SPRINTS_X_ID_BACKLOG(?);`;
    const [results] = await connection.query(query,[idBacklog]);
    const sprints = results[0];
    return sprints;
}

async function modificarEstado(req,res,next){
    const {idSprint,estado} = req.body;
    try{
        const query = `CALL MODIFICAR_ESTADO_SPRINT(?,?);`;
        await connection.query(query,[idSprint,estado]);
        res.status(200).json({message: "Estado de sprint modificado"});
    }catch(error){
        next(error);
    }
}

async function eliminarSprint(req,res,next){
    const {idSprint,tareas} = req.body;
    try{
        for(const tarea of tareas){
            await tareaController.funcEliminarTarea(tarea.idTarea);
        }
        const query = `CALL ELIMINAR_SPRINT(?);`;
        await connection.query(query,[idSprint]);
        res.status(200).json({message: "Sprint eliminado"});
    }catch(error){
        next(error);
    }
}


module.exports = {
    crear,
    listarSprintsXIdBacklog,
    modificarEstado,
    eliminarSprint
}