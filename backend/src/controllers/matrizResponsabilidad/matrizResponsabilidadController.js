const connection = require("../../config/db");

async function listarResponsabilidad(req,res,next){
    const{idProyecto} = req.params;
    const query = `CALL LISTAR_RESPONSABILIDADROL_X_IDPROYECTO(?);`;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        const responsabilidadRol = results[0];
        res.status(200).json({responsabilidadRol, message: "ResponsabilidadesRol listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    listarResponsabilidad
};
