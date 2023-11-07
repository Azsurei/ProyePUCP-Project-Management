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

async function modificar(req,res,next){
    const {idSprint,descripcion,fechaInicio,fechaFin,estado,nombre} = req.body;
    try {
        const query = `CALL MODIFICAR_SPRINT(?,?,?,?,?,?);`;
        await connection.query(query,[idSprint,descripcion,fechaInicio,fechaFin,estado,nombre]);
        console.log(`Sprint ${idSprint} modificado`);
        res.status(200).json({message: "Sprint modificado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarSprintsXIdBacklogCronograma(req,res,next){
    const {idBacklog,idCronograma} = req.params;
    
    try {
        const sprints = await funcListarSprintsXIdBacklog(idBacklog);
        for(const sprint of sprints){
            const tareas = await tareaController.funcListarTareasXIdSprint(sprint.idSprint);
            sprint.tareas = tareas;
        }
        //Listar los sprints de sin sprint
        // Crear un objeto para "Sin Sprint" y añadirlo al array de sprints
        const tareasSinSprint = await tareaController.funcListarTareasSinSprint(idCronograma);
        const sinSprint = {
            idSprint: 0,
            nombre: "Sin Sprint",
            tareas: tareasSinSprint
        };
        sprints.push(sinSprint);
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
            await tareaController.funcModificarTareaIdSprint(tarea.idTarea,0);
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
    listarSprintsXIdBacklogCronograma,
    modificarEstado,
    modificar,
    eliminarSprint
}