const connection = require("../../config/db");
const tareaController = require("../cronograma/tareaController");

async function crear(req,res,next){
    const {idProductBacklog,descripcion,fechaInicio,fechaFin,estado,nombre} = req.body;
    try {
        const query = `CALL INSERTAR_SPRINT(?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idProductBacklog,descripcion,fechaInicio,fechaFin,estado,nombre]);
        const idSprint = results[0][0].idSprint;
        res.status(200).json({idSprint, message: "Sprint creado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarSprintsXIdBacklog(req,res,next){
    const {idBacklog} = req.params;
    sprints.sinSprint=[];
    try {
        const sprints = await funcListarSprintsXIdBacklog(idBacklog);
        for(const sprint of sprints){
            const tareaAux = await tareaController.funcListarTareasXIdSprint(sprint.idSprint);
            if(tareaAux.idTarea >0){
                sprint.tareas = tareaAux;
            
            }else{
                sprints.sinSprint.push(tareaAux);
            }
        }
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

module.exports = {
    crear,
    listarSprintsXIdBacklog
}