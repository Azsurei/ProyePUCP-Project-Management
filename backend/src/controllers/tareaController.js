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


module.exports = {
    crear
};
