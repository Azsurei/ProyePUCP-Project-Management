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

async function listar(req,res,next){
    const {idActaConstitucion} = req.body;
    try {
        const query = `CALL LISTAR_DETALLEAC_X_IDACTA(?);`;
        const [results] = await connection.query(query,[idActaConstitucion]);
        const detalleAC = results[0];
        res.status(200).json({detalleAC, message: "DetalleAC listado"});
    } catch (error) {
        next(error);
    }
}

async function modificarCampos(req,res,next){
    const{detalleAC} = req.body;
    try {
        for (const campo of detalleAC) {
            console.log(`Datos: ${campo.idDetalle},${campo.nombre},${campo.detalle}`);
            const [results] = await connection.execute(`
            CALL MODIFICAR_CAMPO_DETALLEAC(
                ${campo.idDetalle},
                '${campo.nombre}',
                '${campo.detalle}'
            );
            `);
        }
        res.status(200).json({message: "DetalleAC modificado"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listar,
    modificarCampos
};
