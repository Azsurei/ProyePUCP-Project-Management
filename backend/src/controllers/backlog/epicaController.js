const connection = require("../../config/db");

async function listarEpicasXIdBacklog(req,res,next){
    const {idBacklog} = req.params;
    try {
        const query = `CALL LISTAR_EPICAS_X_ID_BACKLOG(?);`;
        const [results] = await connection.query(query,[idBacklog]);
        const epicas = results[0];
        res.status(200).json({epicas, message: "Epicas listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    listarEpicasXIdBacklog
}