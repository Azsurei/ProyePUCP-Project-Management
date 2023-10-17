const connection = require("../config/db");

async function crear(req,res,next){
    const {idCronograma,idSubGrupo,idPadre,idTareaAnterior,sumillaTarea,
        descripcion,fechaInicio,fechaFin,cantSubtareas,cantPosteriores,
        horasPlaneadas} = req.body;
    try {
        const query = `CALL INSERTAR_TAREA(?,?,?,?,?,?,?,?,?,?,?);`;
        await connection.query(query,[idCronograma,idSubGrupo,idPadre,idTareaAnterior,sumillaTarea,descripcion,fechaInicio,fechaFin,cantSubtareas,cantPosteriores,horasPlaneadas]);
        res.status(200).json({message: "Tarea creada"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_TAREAS_X_ID_PROYECTO(?);`;
        const [tareas] = connection.query(query,[idProyecto]);
        res.status(200).json({
            tareas,
            message: "Tareas listadas correctamente"
        });

        for(const tarea of tareas){
            if (tarea.idEquipo != null){
                //usuarios completo menos password
                //nombre e id de subequipo
                const query2 = `CALL LISTAR_EQUIPO_X_ID_EQUIPO(?);`;
                const [equipo] = await connection.query(query, [tarea.idEquipo]);
            }else{

            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdProyecto
};
