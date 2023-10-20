const connection = require("../config/db");

//Todo va a ser idProyecto
async function listar(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query1 = `CALL LISTAR_ACTA_X_IDPROYECTO(?);`;
        const [acta] = await connection.query(query1,[idProyecto]);
        const query2 = `CALL LISTAR_DETALLEAC_X_IDPROYECTO(?);`;
        const [results] = await connection.query(query2,[idProyecto]);
        const detalleAC = {
            general: acta[0],
            actaData: results[0]
        };
        res.status(200).json({detalleAC, message: "DetalleAC listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function modificarCampos(req,res,next){
    const{idProyecto, nombreProyecto, empresa, cliente, patrocinador, gerente, actaData} = req.body;
    try {
        const query1 = `CALL MODIFICAR_ACTA_CONSTITUCION(?,?,?,?,?,?);`;
        const [acta] = await connection.query(query1,[idProyecto, nombreProyecto, 
            empresa, cliente, patrocinador, gerente]);
        for (const campo of actaData) {
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

async function crearCampos(req,res,next){
    const{idProyecto, nombreCampo, detalleCampo} = req.body;
    try {
        const query1 = `CALL CREAR_CAMPO_AC(?,?,?);`;
        const [results] = await connection.query(query1,[idProyecto, nombreCampo, detalleCampo]);
        campoCreado = results[0][0];
        res.status(200).json({campoCreado: campoCreado, message: "CampoAC Creado"});
    } catch (error) {
        next(error);
    }
}

async function eliminarCampo(req,res,next){
    const{idDetalle} = req.body;
    try {
        const query1 = `CALL ELIMINAR_CAMPO_AC(?);`;
        const [results] = await connection.query(query1,[idDetalle]);
        res.status(200).json({message: "CampoAC Eliminado"});
    } catch (error) {
        next(error);
    }
}

async function listarInteresados(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_INTERESADOAC_AC(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        const interesadoAC = results[0];
        res.status(200).json({interesadoAC, message: "InteresadoAC listado"});
    } catch (error) {
        next(error);
    }
}
async function insertarInteresado(req,res,next){
    const{idProyecto, nombre, cargo, organizacion} = req.body;
    const query = `
        CALL INSERTAR_INTERESADOAC(?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto,nombre,cargo,organizacion]);
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
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_HITOAC_X_AC(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        const hitoAC = results[0];
        res.status(200).json({hitoAC, message: "HitoAC listado"});
    } catch (error) {
        next(error);
    }
}
async function insertarHito(req,res,next){
    const{idProyecto, descripcion, fechaLimite} = req.body;
    const query = `
        CALL INSERTAR_HITOAC(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto,descripcion,fechaLimite]);
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
    crearCampos,
    eliminarCampo,
    listarInteresados,
    insertarInteresado,
    listarHito,
    insertarHito
};
