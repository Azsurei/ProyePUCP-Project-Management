const connection = require("../config/db");

async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        const query = `CALL INSERTAR_CRONOGRAMA(?);`;
        await connection.query(query,[idProyecto]);
        res.status(200).json({message: "Cronograma creado"});
    } catch (error) {
        next(error);
    }
}

async function actualizar(req,res,next){
    const {idProyecto,fechaInicio,fechaFin} = req.body;
    try {
        const query = `CALL ACTUALIZAR_CRONOGRAMA(?,?,?);`;
        await connection.query(query,[idProyecto,fechaInicio,fechaFin]);
        res.status(200).json({message: "Cronograma actualizado"});
    } catch (error) {
        next(error);
    }
}

async function listar(req,res,next){
    const {idProyecto} = req.body;
    try {
        const query = `CALL LISTAR_CRONOGRAMA_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({cronograma: results[0][0]});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    actualizar,
    listar
};
