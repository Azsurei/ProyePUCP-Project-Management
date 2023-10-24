const connection = require("../../config/db");

async function crear(req,res,next){
    const {idLineaActaReunion,descripcion} = req.body;
    try {
        const query = `CALL INSERTAR_TEMA_REUNION(?,?);`;
        await connection.query(query,[idLineaActaReunion,descripcion]);
        res.status(200).json({message: "Tema reunion creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {
        const query = `CALL LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const [results] = await connection.query(query,[idLineaActaReunion]);
        const temasReunion = results[0];
        res.status(200).json({
            temasReunion,
            message: "Temas de reunion listados"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdLineaActaReunion
}