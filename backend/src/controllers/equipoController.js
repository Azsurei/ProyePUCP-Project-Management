const connection = require("../config/db");

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

module.exports = {
    listarXIdProyecto
};

