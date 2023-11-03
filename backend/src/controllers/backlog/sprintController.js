const connection = require("../../config/db");
const tareaController = require("../cronograma/tareaController");
async function listarSprintsXIdBacklog(req,res,next){
    const {idBacklog} = req.params;
    try {
        const sprints = await funcListarSprintsXIdBacklog(idBacklog);
        for(const sprint of sprints){
            const tareaAux = await tareaController.funcListarTareasXIdSprint(sprint.idSprint);
            if(tareaAux.idTarea >0){
                sprint.tareas = tareaAux;
            
            }else{
                sprints.push(tareaAux);
            }
        }
        res.status(200).json({sprints, message: "Sprints listado"});
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
    listarSprintsXIdBacklog
}