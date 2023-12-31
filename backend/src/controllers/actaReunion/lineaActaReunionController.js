const connection = require("../../config/db");
const temaReunionController = require("./temaReunionController");
const participanteXReunionController = require("./participanteXReunionController");
const comentarioReunionController = require("./comentarioReunionController");
const acuerdoController = require("./acuerdoController");
const responsableAcuerdoController = require("./responsableAcuerdoController");
const fileController = require("../files/fileController");

async function crear(req,res,next){
    console.log(req.file);
    const {idActaReunion,nombreReunion,fechaReunion,horaReunion,idConvocante,motivo,temas,participantes,comentarios} = req.body;
    try {
        const idArchivo = await fileController.subirArchivo(req.file);
        const idLineaActaReunion = await funcCrear(idActaReunion,nombreReunion,fechaReunion,horaReunion,idConvocante,idArchivo,motivo,temas,participantes,comentarios);
        console.log(`Linea acta reunion ${idLineaActaReunion} creada`)
        res.status(200).json({
            idLineaActaReunion,
            message: "Linea acta reunion creada"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdActaReunion(req,res,next){
    const {idActaReunion} = req.params;
    try {
        const query = `CALL LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION(?);`;
        const results = await connection.query(query,[idActaReunion]);
        const lineasActaReunion = results[0][0];
        console.log(lineasActaReunion);
        for(const linea of lineasActaReunion){
            const query2 = `CALL LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
            const [resulstParticipanteXReunion] = await connection.query(query2,[linea.idLineaActaReunion]);
            linea.participantesXReunion = resulstParticipanteXReunion[0];
        }
        res.status(200).json({
            lineasActaReunion,
            message: "Lineas acta reunion listadas"});
    } catch (error) {
        next(error);
    }
}

async function eliminarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.body;
    try {
        const response = await funcEliminarXIdLineaActaReunion(idLineaActaReunion);

        if(response === 1){
            res.status(200).json({
                message: "Linea acta reunion eliminada"});
        }
        else{
            res.status(400).json({
                message: "Error al eliminar linea acta reunion"});
        }
        
    } catch (error) {
        next(error);
    }
}

async function funcEliminarXIdLineaActaReunion(idLineaActaReunion){
    try {
        const query = `CALL ELIMINAR_LINEA_ACTA_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const results = await connection.query(query,[idLineaActaReunion]);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {
        const query = `CALL LISTAR_LINEA_ACTA_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const [results] = await connection.query(query,[idLineaActaReunion]);
        const lineaActaReunion = results[0][0];
        console.log(lineaActaReunion);
        if (!lineaActaReunion) {
            return res.status(400).json({ message: "El ID de la línea del acta de reunión debe ser valido y debe estar activo" });
        }
        const extension = lineaActaReunion.nombreReal.slice(lineaActaReunion.nombreReal.lastIndexOf('.'));
        lineaActaReunion.extension = extension;
        //lineaActaReunion.comentarios = await comentarioReunionController.funcListarXIdLineaActaReunion(idLineaActaReunion);
        //lineaActaReunion.participantesXReunion = await participanteXReunionController.funcListarXIdLineaActaReunion(idLineaActaReunion);
        //lineaActaReunion.temasReunion = await temaReunionController.funcListarXIdLineaActaReunion(idLineaActaReunion);
        // for(temaReunion of lineaActaReunion.temasReunion){
        //     temaReunion.acuerdos = await acuerdoController.funcListarXIdTemaReunion(temaReunion.idTemaReunion);
        //     for(acuerdo of temaReunion.acuerdos){
        //         acuerdo.responsables = await responsableAcuerdoController.funcListarXIdAcuerdo(acuerdo.idAcuerdo);
        //     }
        // }
        res.status(200).json({
            lineaActaReunion,
            message: "Lineas acta reunion listadas"});
    } catch (error) {
        next(error);
    }
}

async function modificar(req,res,next){
    console.log(req.file);
    const {idLineaActaReunion,nombreReunion,fechaReunion,horaReunion,idConvocante,motivo,idArchivo,hasFileBeenChanged} = req.body;
    try {
        let nuevoIdArchivo = idArchivo;
        console.log(req.body);
        if(parseInt(hasFileBeenChanged)===1){
            console.log("subiendo nuevo archivo");
            nuevoIdArchivo = await fileController.subirArchivo(req.file);
            if(nuevoIdArchivo === -1){
                return res.status(400).json({ message: "Error al subir archivo" });
            }
        }else{
            nuevoIdArchivo = idArchivo;
        }
        
        const query = `CALL MODIFICAR_LINEA_ACTA_REUNION(?,?,?,?,?,?,?);`;
        const [result] = await connection.query(query,[idLineaActaReunion,nombreReunion,fechaReunion,horaReunion,idConvocante,motivo,nuevoIdArchivo]);

        res.status(200).json({
            message: "Linea acta reunion modificada"});
    } catch (error) {
        next(error);
    }
}


async function funcCrear(idActaReunion,nombreReunion,fechaReunion,horaReunion,idConvocante,idArchivo, motivo,temas,participantes,comentarios){

    try {
        const query = `CALL INSERTAR_LINEA_ACTA_REUNION(?,?,?,?,?,?,?);`;
        [results] = await connection.query(query,[idActaReunion,nombreReunion,fechaReunion,horaReunion,idConvocante,idArchivo,motivo]);
        const idLineaActaReunion = results[0][0].idLineaActaReunion;

        console.log(idLineaActaReunion,results[0][0]);
        
        //console.log(idLineaActaReunion,results[0][0]);
        // console.log("Temas:==========================================");
        // console.log(temas);
        // console.log("Comentarios:==========================================");
        // console.log(comentarios);
        // for(const tema of temas){
        //     await temaReunionController.funcCrear(idLineaActaReunion,tema.descripcion,tema.acuerdos);
        // }

        // for(const participante of participantes){
        //     await participanteXReunionController.funcCrear(idLineaActaReunion, participante.idUsuarioXRolXProyecto, participante.asistio);
        // }

        // for(comentario of comentarios){
        //     await comentarioReunionController.funcCrear(idLineaActaReunion, comentario.descripcion);
        // }
        return idLineaActaReunion;
    } catch (error) {
        console.log(error);
    }   
    
}

async function funcModificar(idLineaActaReunion,nombreReunion,fechaReunion,horaReunion,nombreConvocante,motivo,temas,participantes,comentarios){
    try {
        const query = `CALL MODIFICAR_LINEA_ACTA_REUNION(?,?,?,?,?,?);`;
        [results] = await connection.query(query,[idLineaActaReunion,nombreReunion,fechaReunion,horaReunion,nombreConvocante,motivo]);

        for(const tema of temas){
            temaReunionController.funcModificar(idLineaActaReunion,tema.descripcion,tema.acuerdos);
        }

        for(const participante of participantes){
            participanteXReunionController.funcModificar(idLineaActaReunion,participante.idUsuarioXRolXProyecto,participante.asistio);
        }

        for(const comentario of comentarios){
            comentarioReunionController.funcModificar(idLineaActaReunion,comentario.descripcion);
        }

    } catch (error) {
        console.log(error);
        return 0;
    }
    return 1;
}

module.exports = {
    crear,
    listarXIdActaReunion,
    funcCrear,
    listarXIdLineaActaReunion,
    eliminarXIdLineaActaReunion,
    modificar
}