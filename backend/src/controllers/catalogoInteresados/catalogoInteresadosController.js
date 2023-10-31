const connection = require("../../config/db");

async function listarAutoridad(req,res,next){
    try {
        const query = `CALL LISTAR_INTERESADO_AUTORIDAD;`;
        const [results] = await connection.query(query);
        const autoridades = results[0];
        res.status(200).json({autoridades, message: "Autoridades listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function listarAdhesion(req,res,next){
    try {
        const query = `CALL LISTAR_INTERESADO_ADHESION;`;
        const [results] = await connection.query(query);
        const adhesiones = results[0];
        res.status(200).json({adhesiones, message: "Adhesiones listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports = {
    listarAutoridad,
    listarAdhesion
};
