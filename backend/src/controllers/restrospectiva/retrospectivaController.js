const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        const idRetrospectiva=await funcCrear(idProyecto);
        res.status(200).json({message: `Retrospectiva ${idRetrospectiva}creada`});
    } catch (error) {
        next(error);
    }

}

async function funcCrear(idProyecto){
    try {
        const query = 'INSERTAR_RETROSPECTIVA(?)';
        const [result] = await connection.query(query,[idProyecto]);
        console.log(result[0].idRetrospectiva);
        return result[0].idRetrospectiva;
    } catch (error) {
        throw error;
    }
}




module.exports={
    crear
}