const connection = require("../../config/db");


async function crear(req,res,next){
    const {idTemaReunion,descripcion,fechaObjetivo} = req.body;
    try {
        const query = `CALL INSERTAR_ACUERDO(?,?,?);`;
        await connection.query(query,[idTemaReunion,descripcion,fechaObjetivo]);
        res.status(200).json({message: "Acuerdo creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdTemaReunion(req,res,next){
    const {idTemaReunion} = req.params;
    try {
        const query = `CALL LISTAR_ACUERDO_X_ID_TEMA_REUNION(?);`;
        const [results] = await connection.query(query,[idTemaReunion]);
        const acuerdos = results[0];
        res.status(200).json({
            acuerdos,
            message: "Acuerdos listados"});
    } catch (error) {
        next(error);
    }
}


module.exports = {
    crear,
    listarXIdTemaReunion
}