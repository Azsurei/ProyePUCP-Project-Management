const connection = require("../../config/db");

async function crear(req,res,next){
    const {idLineaRetrospectiva,idCriterioRetrospectiva,descripcion} = req.body;
    try {
        const idItemLineaRetrospectiva=await funcCrear(idLineaRetrospectiva,idCriterioRetrospectiva,descripcion);
        res.status(200).json({
            idItemLineaRetrospectiva,
            message: `ItemLineaRetrospectiva ${idItemLineaRetrospectiva}creada`});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idLineaRetrospectiva,idCriterioRetrospectiva,descripcion){
    try {
        const query = 'INSERTAR_ITEM_LINEA_RETROSPECTIVA(?,?,?)';
        const [result] = await connection.query(query,[idLineaRetrospectiva,idCriterioRetrospectiva,descripcion]);
        console.log(result[0].idItemLineaRetrospectiva);
        return result[0].idItemLineaRetrospectiva;
    } catch (error) {
        throw error;
    }
}

module.exports={
    crear
}