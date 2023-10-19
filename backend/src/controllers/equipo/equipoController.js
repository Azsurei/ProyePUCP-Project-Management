const connection = require("../../config/db");

async function insertarEquipoYParticipantes(req,res,next){
    //Insertar query aca
    const {idProyecto,nombre,descripcion,usuarios} = req.body;
    console.log("Llegue a recibir solicitud insertar componente edt");
    const query = `
        CALL INSERTAR_EQUIPO(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto, nombre, descripcion]);
        const idEquipo = results[0][0].idEquipo;
        console.log(`Se creo el equipo${idEquipo}!`);
        // Iteracion
        for (const usuario of usuarios) {
            if(usuario.data!==""){
                const [usuarioXEquipoRows] = await connection.execute(`
                CALL INSERTAR_USUARIO_X_EQUIPO(
                    ${usuario.idUsuario},
                    '${idEquipo}'
                );
                `);
                const idUsuarioXEquipo = usuarioXEquipoRows[0][0].idUsuarioXEquipo;
                console.log(`Se insertó el usuario ${usuario.idUsuario} en el equipo ${idEquipo}`);
            }
        }
        res.status(200).json({
            idEquipo,
            message: "Equipo insertado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
}
async function listarXIdProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_EQUIPO_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        equipos = results[0];

         res.status(200).json({
            equipos,
             message: "Equipos listadas correctamente"
         });
    } catch (error) {
        next(error);
    }
}

async function listarEquipos(req,res,next){
    const {idProyecto} = req.params;
    const query = `CALL LISTAR_INTERESADOAC_AC(?);`;
    try {
        const [results] = await connection.query(query);
        res.status(200).json({
            historiasEstado: results[0],
            message: "Historias estado obtenidos exitosamente"
        });
        console.log('Si se listarion los estados de las historias');
    } catch (error) {
        console.error("Error al obtener las historias estado:", error);
        res.status(500).send("Error al obtener las historias estado: " + error.message);
    }
}

module.exports = {
    insertarEquipoYParticipantes,
    listarXIdProyecto,
    listarEquipos
};
