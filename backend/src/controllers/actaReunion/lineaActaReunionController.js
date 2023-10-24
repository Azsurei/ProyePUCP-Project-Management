const connection = require("../../config/db");

async function crear(req,res,next){
    const {idActaReunion,nombreReunion,fechaReunion,horaReunion,nombreConvocante,motivo} = req.body;
    try {
        const query = `CALL INSERTAR_LINEA_ACTA_REUNION(?,?,?,?,?,?);`;
        await connection.query(query,[idActaReunion,nombreReunion,fechaReunion,horaReunion,nombreConvocante,motivo]);
        res.status(200).json({message: "Linea acta reunion creada"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdActaReunion(req,res,next){
    const {idActaReunion} = req.params;
    try {
        const query = `CALL LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION(?);`;
        const results = await connection.query(query,[idActaReunion]);
        const lineasActaReunion = results[0];
        res.status(200).json({
            lineasActaReunion,
            message: "Lineas acta reunion listadas"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdActaReunion
}