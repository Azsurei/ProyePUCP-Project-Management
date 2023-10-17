const connection = require("../config/db");

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

async function listarInteresados(req,res,next){
    const {idActaConstitucion} = req.body;
    try {
        const query = `CALL LISTAR_INTERESADOAC_X_IDACTA(?);`;
        const [results] = await connection.query(query,[idActaConstitucion]);
        const interesadoAC = results[0];
        res.status(200).json({interesadoAC, message: "InteresadoAC listado"});
    } catch (error) {
        next(error);
    }
}
async function insertarInteresado(req,res,next){
    const{idActaConstitucion, nombre, cargo, organizacion} = req.body;
    const query = `
        CALL INSERTAR_INTERESADOAC(?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idActaConstitucion,nombre,cargo,organizacion]);
        const idInteresado = results[0][0].idInteresado;
        console.log(`Se insertó el interesado ${idInteresado}!`);
        res.status(200).json({
            idInteresado,
            message: "InteresadoAC insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function listarHito(req,res,next){
    const {idActaConstitucion} = req.body;
    try {
        const query = `CALL LISTAR_HITOAC_X_IDACTA(?);`;
        const [results] = await connection.query(query,[idActaConstitucion]);
        const hitoAC = results[0];
        res.status(200).json({hitoAC, message: "HitoAC listado"});
    } catch (error) {
        next(error);
    }
}
async function insertarHito(req,res,next){
    const{idActaConstitucion, descripcion, fechaLimite} = req.body;
    const query = `
        CALL INSERTAR_HITOAC(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idActaConstitucion,descripcion,fechaLimite]);
        const idHito = results[0][0].idHito;
        console.log(`Se insertó el hito ${idHito}!`);
        res.status(200).json({
            idHito,
            message: "Hito insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    modificarCampos,
    listarInteresados,
    insertarInteresado,
    listarHito,
    insertarHito
};
