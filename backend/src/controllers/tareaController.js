const connection = require("../config/db");

async function crear(req, res, next) {
    const { 
        idCronograma, idTareaEstado, idSubGrupo, idPadre, idTareaAnterior, sumillaTarea,
        descripcion, fechaInicio, fechaFin, cantSubtareas, cantPosteriores,
        horasPlaneadas, usuarios, subTareas, tareasPosteriores 
    } = req.body;

    try {
        const idTarea = await insertarTarea(req.body);
        await insertarUsuarios(usuarios, idTarea);
        await insertarTareas(subTareas);
        await insertarTareas(tareasPosteriores);

        res.status(200).json({ message: `Tarea ${idTarea} creada` });
    } catch (error) {
        next(error);
        console.log(error);
    }
}

async function insertarTarea(data) {
    const query = `CALL INSERTAR_TAREA(?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [results] = await connection.query(query, [
        data.idCronograma, data.idTareaEstado, data.idSubGrupo, data.idPadre, data.idTareaAnterior, 
        data.sumillaTarea, data.descripcion, data.fechaInicio, data.fechaFin, 
        data.cantSubtareas, data.cantPosteriores, data.horasPlaneadas
    ]);
    return results[0][0].idTarea;
}

async function insertarUsuarios(usuarios, idTarea) {
    if (usuarios) {
        const query = `CALL INSERTAR_USUARIO_X_TAREA(?,?);`;
        for (const usuario of usuarios) {
            await connection.query(query, [usuario.idUsuario, idTarea]);
        }
    }
}

async function insertarTareas(tareas) {
    if (tareas) {
        for (const tarea of tareas) {
            const idTarea = await insertarTarea(tarea.body);
            await insertarUsuarios(tarea.body.usuarios, idTarea);
        }
    }
}


async function listarXIdProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_TAREAS_X_ID_PROYECTO(?);`;
        const [resultsTareas] = await connection.query(query,[idProyecto]);
        tareas = resultsTareas[0];
        
        
        for(const tarea of tareas){
            if (tarea.idEquipo != null){
                 //usuarios completo menos password
                 //nombre e id de subequipo
                 const query2 = `CALL LISTAR_EQUIPO_X_ID_EQUIPO(?);`;
                 const [equipo] = await connection.query(query2, [tarea.idEquipo]);
                 tarea.equipo = equipo[0][0]; //solo consideramos que una tarea es asignada a un subequipo
                 tarea.usuarios = null;
                 //listamos los participantes de dicho equipo
                 const query4 = `CALL LISTAR_PARTICIPANTES_X_IDEQUIPO(?);`;
                 const [participantes] = await connection.query(query4, [tarea.idEquipo]);
                 tarea.equipo.participantes = participantes[0]; 
             }else {
                 const query3 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
                 const [usuarios] = await connection.query(query3, [tarea.idTarea]);
                 if(usuarios != null){
                     tarea.usuarios = usuarios[0];
                 }
                 tarea.equipo = null;
             }
         }
         tareasOrdenadas = structureData(tareas);
         res.status(200).json({
            tareasOrdenadas,
             message: "Tareas listadas correctamente"
         });
    } catch (error) {
        next(error);
    }
}

// Función para estructurar los datos en un arreglo
function structureData(data) {
    const result = {};
  
    // Organizar las tareas por idPadre
    data.forEach((task) => {
      const parentId = task.idPadre;
      if (!result[parentId]) {
        result[parentId] = [];
      }
      result[parentId].push(task);
    });
  
    if (!result[null]) {
      return [];
    }
  
    // Función para agregar hijos a las tareas
    function addChildren(task) {
      task.tareasHijas  = result[task.idTarea] || [];
      if (task.tareasHijas .length === 0) {
        return;
      }
      task.tareasHijas .forEach(addChildren);
    }
  
    // Agregar hijos a las tareas principales (con idPadre null)
    result[null].forEach(addChildren);
  
    return result[null];
  }

module.exports = {
    crear,
    listarXIdProyecto
};
