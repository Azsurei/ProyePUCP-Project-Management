const connection = require("../../config/db");
const criterioRetrospectivaCrontroller = require("./criterioRetrospectivaController");

async function crear(req,res,next){
    const {idLineaRetrospectiva,idCriterioRetrospectiva,descripcion} = req.body;
    try {
        const idItemLineaRetrospectiva=await funcCrear(idLineaRetrospectiva,idCriterioRetrospectiva,descripcion);
        res.status(200).json({
            idItemLineaRetrospectiva,
            message: `ItemLineaRetrospectiva ${idItemLineaRetrospectiva} creada`});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idLineaRetrospectiva,idCriterioRetrospectiva,descripcion){
    try {
        const query = 'CALL INSERTAR_ITEM_LINEA_RETROSPECTIVA(?,?,?);';
        const [result] = await connection.query(query,[idLineaRetrospectiva,idCriterioRetrospectiva,descripcion]);
        const idItemLineaRetrospectiva =result[0][0].idItemLineaRetrospectiva;
        return idItemLineaRetrospectiva;
    } catch (error) {
        throw error;
    }
}

async function listarXIdLineaRetrospectiva(req,res,next){
    const {idLineaRetrospectiva} = req.params;
    try {
        
        criterios=await criterioRetrospectivaCrontroller.funclistarTodos();
        for(const criterio of criterios){
            criterio.items = await funcListarXIdLineaRetrospectivaYCriterio(idLineaRetrospectiva,criterio.idCriterioRetrospectiva);
        }
        const itemLineasRetrospectiva = criterios;
        res.status(200).json({
            itemLineasRetrospectiva,
            message: "ItemLineasRetrospectiva listadas correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function funcListarXIdLineaRetrospectivaYCriterio(idLineaRetrospectiva,idCriterioRetrospectiva){
    try {
        const query = `CALL LISTAR_ITEM_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA_CRITERIO(?,?);`;
        const [results] = await connection.query(query,[idLineaRetrospectiva,idCriterioRetrospectiva]);
        itemLineasRetrospectiva = results[0];
        
        return itemLineasRetrospectiva;
    } catch (error) {
        console.log(error);
    }
}

async function eliminarXIdLineaRetrospectiva(idLineaRetrospectiva){
    try {
        const query = `CALL ELIMINAR_ITEM_LINEA_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA(?);`;
        await connection.query(query,[idLineaRetrospectiva]);
    } catch (error) {
        console.log(error);
    }
}

async function modificar(req,res,next){
    const {idItemLineaRetrospectiva,descripcion} = req.body;
    try {
        const query = `CALL MODIFICAR_ITEM_LINEA_RETROSPECTIVA(?,?);`;
        await connection.query(query,[idItemLineaRetrospectiva,descripcion]);
        res.status(200).json({message: `ItemLineaRetrospectiva ${idItemLineaRetrospectiva} modificada`});
    } catch (error) {
        next(error);
    }

}

async function eliminar(req,res,next){
    const {idItemLineaRetrospectiva} = req.body;
    try {
        await funcEliminar(idItemLineaRetrospectiva);
        res.status(200).json({message: `ItemLineaRetrospectiva ${idItemLineaRetrospectiva} eliminada`});
    } catch (error) {
        next(error);
    }

}

async function funcEliminar(idItemLineaRetrospectiva){
    try {
        const query = `CALL ELIMINAR_ITEM_LINEA_RETROSPECTIVA_X_ID_ITEM_LINEA_RETROSPECTIVA(?);`;
        await connection.query(query,[idItemLineaRetrospectiva]);
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    crear,
    listarXIdLineaRetrospectiva,
    modificar,
    eliminar,
    eliminarXIdLineaRetrospectiva
}