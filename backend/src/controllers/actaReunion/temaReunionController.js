const connection = require("../../config/db");
const acuerdoController = require("./acuerdoController");

async function crear(req,res,next){
    const {idLineaActaReunion,descripcion,acuerdos} = req.body;
    try {
        idTemaReunion = await funcCrear(idLineaActaReunion,descripcion,acuerdos);
        res.status(200).json({
            idTemaReunion,
            message: "Tema reunion creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {
        const temasReunion = await funcListarXIdLineaActaReunion(idLineaActaReunion);
        res.status(200).json({
            temasReunion,
            message: "Temas de reunion listados"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idLineaActaReunion,descripcion,acuerdos){
    try {
        const query = `CALL INSERTAR_TEMA_REUNION(?,?);`;
        const [results]=await connection.query(query,[idLineaActaReunion,descripcion]);
        idTemaReunion = results[0][0].idTemaReunion;
        console.log('Tema reunion con id: ',idTemaReunion);
        for(acuerdo of acuerdos){
            acuerdoController.funcCrear(idTemaReunion,acuerdo.descripcion,acuerdo.fechaObjetivo,acuerdo.responsables);
        }
    } catch (error) {
        next(error);
    }
    return idTemaReunion;
}

async function funcListarXIdLineaActaReunion(idLineaActaReunion){
    let temasReunion;
    try {
        const query = `CALL LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const [results] = await connection.query(query,[idLineaActaReunion]);
        temasReunion = results[0];
    } catch (error) {
        console.error("Error al listar comentarios de reunion:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return temasReunion;
}

async function funcModificar(idTemaReunion,descripcion,acuerdos){
    try {
        const query = `CALL MODIFICAR_TEMA_REUNION(?,?);`;
        const [results]=await connection.query(query,[idTemaReunion,descripcion]);
        for(acuerdo of acuerdos){
            acuerdoController.funcModificar(acuerdo.idAcuerdo,acuerdo.descripcion,acuerdo.fechaObjetivo,acuerdo.responsables);
        }
    } catch (error) {
        next(error);
    }
    return idTemaReunion;
}

module.exports = {
    crear,
    listarXIdLineaActaReunion,
    funcCrear,
    funcListarXIdLineaActaReunion,
    funcModificar
}