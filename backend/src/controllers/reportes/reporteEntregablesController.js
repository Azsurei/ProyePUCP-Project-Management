const connection = require("../../config/db");

async function generarReporteEntregables(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_ENTREGABLES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        const entregables = results[0];

        console.log("Entregables listados con exito ");

        const query2 = `CALL LISTAR_TAREAS_X_ID_ENTREGABLE(?);`;
        for (const entregable of entregables) {
            const [results2] = await connection.query(query2, [
                entregable.idEntregable,
            ]);
            const tareasEntregable = results2[0];

            for (const tarea of tareasEntregable) {
                if (tarea.idEquipo !== null) {

                    const query4 = `CALL LISTAR_EQUIPO_X_ID_EQUIPO(?);`;
                    const [equipo] = await connection.query(query4, [
                        tarea.idEquipo,
                    ]);
                    tarea.equipo = equipo[0][0]; //solo consideramos que una tarea es asignada a un subequipo

                    //listamos los participantes de dicho equipo
                    const query5 = `CALL LISTAR_PARTICIPANTES_X_IDEQUIPO(?);`;
                    const [participantes] = await connection.query(query5, [
                        tarea.idEquipo,
                    ]);
                    tarea.equipo.participantes = participantes[0];
                    tarea.usuarios = [];
                } else {

                    const query6 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
                    const [usuarios] = await connection.query(query6, [
                        tarea.idTarea,
                    ]);
                    if (usuarios != null) {
                        tarea.usuarios = usuarios[0];
                    }
                    tarea.equipo = null;
                    
                }
            }

            entregable.tareasEntregable = tareasEntregable;
        }

        res.status(200).json({
            entregables,
            message: "Se listaron los entregables con exito",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    generarReporteEntregables,
};
