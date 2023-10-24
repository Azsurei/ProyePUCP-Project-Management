const connection = require("../../config/db");

async function crear(req,res,next){
    const {idAcuerdo,idUsuarioXRolXProyecto} = req.body;
    try {
        const query = `CALL INSERTAR_RESPONSABLE_ACUERDO(?,?,?);`;
        await connection.query(query,[idAcuerdo,idUsuarioXRolXProyecto]);
        res.status(200).json({message: "Responsable acuerdo creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdAcuerdo(req,res,next){
    const {idAcuerdo} = req.params;
    try {
        const query = `CALL LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO(?);`;
        const results = await connection.query(query,[idAcuerdo]);
        const responsablesAcuerdo = results[0];
        res.status(200).json({
            responsablesAcuerdo,
            message: "Responsables acuerdo listados"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdAcuerdo
}