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

module.exports={
}