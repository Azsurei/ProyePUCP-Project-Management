const connection = require("../../config/db");
const criterioAceptacionController = require("./criterioAceptacionController");
const entregableController = require("./entregableController");
const ExcelJS = require("exceljs");
const excelJSController = require("../xlxs/excelJSController");
const path = require("path");
const dateController = require("../dateController");

const headerTitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD8D8D8' } // Usa un color en formato ARGB
    }
};
//Borde para la celda de excel
const borderStyle = {
    top: {style:'thin', color: {argb:'000000'}},
    left: {style:'thin', color: {argb:'000000'}},
    bottom: {style:'thin', color: {argb:'000000'}},
    right: {style:'thin', color: {argb:'000000'}}
  };

  const alignmentCenterStyle = {
    vertical: 'middle',
    horizontal: 'center'
};



// Funcion que reestructura arreglo para poder usarlo en frontend
function restructureArray(array, parentId) {
    const children = array.filter(
        (component) => component.idElementoPadre === parentId
    );
    if (children.length === 0) {
        return null;
    }
    return children.map((child) => {
        const componentesHijos = restructureArray(array, child.idComponente);
        
        let nextSon;
        if (componentesHijos != null) {
            let stringCodigo = componentesHijos[componentesHijos.length - 1].codigo;
            const lastDigit = parseInt(stringCodigo[stringCodigo.length - 1]) + 1;
            stringCodigo = stringCodigo.slice(0, -1) + lastDigit;
            nextSon = stringCodigo;
        } else {
            nextSon = child.codigo + '.1';
        }
        
        return {
            ...child,
            componentesHijos,
            nextSon,
        };
    });
}
function fullyRestructureArray(arregloOriginal){
    const topLevelParents = arregloOriginal.filter(
        (component) => component.idElementoPadre === 1
    );
    const restructuredArray = topLevelParents.map((parent) => {
        const componentesHijos = restructureArray(arregloOriginal, parent.idComponente);

        let nextSon;
        if (componentesHijos != null) {
            let stringCodigo = componentesHijos[componentesHijos.length - 1].codigo;
            const lastDigit = parseInt(stringCodigo[stringCodigo.length - 1]) + 1;
            stringCodigo = stringCodigo.slice(0, -1) + lastDigit;
            nextSon = stringCodigo;
        } else {
            nextSon = parent.codigo + '.1';
        }

        return {
            ...parent,
            componentesHijos,
            nextSon,
        };
    });
    return restructuredArray;
}

// Funciones para Controller

async function listarComponentesEDT(req,res,next){
    console.log("Llegue a recibir solicitud Listar Componentes EDT");
    const idEDT = req.params.idEDT;
    const query = `CALL LISTAR_COMPONENTES_EDT_X_ID_EDT(?);`;
    try {
        const [results] = await connection.query(query, [idEDT]);
        console.log(results[0]);
        const arraySent = fullyRestructureArray(results[0]);
        //const newArray = fullyRestructureArray(results[0]);
        //console.log(newArray);
        
        res.status(200).json({
            componentesEDT: arraySent,
            message: "ComponentesEDT obtenidos exitosamente",
        });
        console.log(
            `Se han listado los componentesEDT para el usuario ${idUsuario} en su proyecto ${idProyecto}!`
        );
    } catch (error) {
        console.error("Error al obtener los componentesEDT:", error);
        res.status(500).send(
            "Error al obtener los componentesEDT: " + error.message
        );
    }
}

async function listarEDT_X_IdProyecto(req, res) {
    console.log("Llegue a recibir solicitud listar EDT por proyecto");
    const idProyecto = req.params.idProyecto;
    const query = `CALL LISTAR_EDT_X_ID_PROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        console.log(results[0]);

        res.status(200).json({
            EDT: results[0],
            message: "EDT obtenido exitosamente",
        });
        console.log(
            `Se han listado el EDT para el proyecto ${idProyecto}!`
        );
    } catch (error) {
        console.error("Error al obtener el EDT:", error);
        res.status(500).send(
            "Error al obtener el EDT: " + error.message
        );
    }
}

async function listarComponentesEDT_X_IdProyecto(req, res, next) {
    console.log("Llegue a recibir solicitud listar EDT por proyecto");
    const idProyecto = req.params.idProyecto;
    const query = `CALL LISTAR_COMPONENTES_EDT_X_ID_PROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        console.log(results[0]);
        const arraySent = fullyRestructureArray(results[0]);

        res.status(200).json({
            componentesEDT: arraySent,
            message: "Componentes EDT obtenido exitosamente",
        });
        console.log(
            `Se han listado los componentes EDT para el proyecto ${idProyecto}!`
        );
    } catch (error) {
        console.error("Error al obtener los componentes EDT:", error);
        res.status(500).send(
            "Error al obtener los componentes EDT: " + error.message
        );
    }
}

async function insertarComponenteEDT(req, res, next) {
    console.log("Recibida solicitud de Crear ComponenteEDT");
    //Insertar query aca
    const {
        idElementoPadre, idProyecto, descripcion, codigo, observaciones, nombre, responsables, 
        fechaInicio, fechaFin, recursos, hito, criterioAceptacion, entregables
    } = req.body;
    try {
        const idComponenteEDT = await funcCrearComponenteEDT(
            idElementoPadre, idProyecto, descripcion, codigo, observaciones, nombre, responsables, 
            fechaInicio, fechaFin, recursos, hito, criterioAceptacion, entregables
        );
        console.log(`ComponenteEDT ${idComponenteEDT} creado`);
        res.status(200).json({
            idComponenteEDT,
            message: "Componente EDT insertado exitosamente",
        });
    } catch (error) {
        console.error("Error en el registro del ComponenteEDT:", error);
        next(error);
    }
}

async function funcCrearComponenteEDT(idElementoPadre, idProyecto, descripcion, codigo, observaciones, nombre, responsables, 
                            fechaInicio, fechaFin, recursos, hito, criterioAceptacion, entregables){
    try {
        console.log("Recibir solicitud Insertar ComponenteEDT");
        const query = `CALL INSERTAR_COMPONENTE_EDT(?,?,?,?,?,?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idElementoPadre, idProyecto, descripcion, codigo, observaciones, 
            nombre, responsables, fechaInicio, fechaFin, recursos, hito]);
        const idComponenteEDT = results[0][0].idComponenteEDT;

        console.log(idComponenteEDT,results[0][0]);
        for (const criterio of criterioAceptacion) {
            if(criterio.data !== ""){
                await criterioAceptacionController.funcCrear(idComponenteEDT, criterio.data);
            }
        }

        for (const entregable of entregables) {
            if(entregable.data!==""){
                await entregableController.funcCrear(idComponenteEDT, entregable.data);
            }
        }
        return idComponenteEDT;
    } catch (error) {
        console.log(error);
    }
}

async function modificarComponenteEDT(req,res,next) {
    console.log("Modificando un ComponenteEDT...");
    //Insertar query aca
    const {idComponenteEDT, descripcion, codigo, observaciones, nombre, responsables, 
        fechaInicio, fechaFin, recursos, hito} = req.body;
    const query = `CALL MODIFICAR_COMPONENTE_EDT(?,?,?,?,?,?,?,?,?,?);`;
    try {
        const [results] = await connection.query(query,[idComponenteEDT, descripcion, codigo, observaciones, 
            nombre, responsables, fechaInicio, fechaFin, recursos, hito]);
        const idComponente= results[0][0].idComponenteEDT;
        console.log(`Se modifico el componente EDT ${idComponente}!`);
        // Pendiente (Falta preguntar)
        // Iteracion
        // for (const criterio of criterioAceptacion) {
        //     const [criterioAceptacionRows] = await connection.query(`
        //     CALL INSERTAR_CRITERIOS_ACEPTACION(
        //         ${idComponenteEDT},
        //         '${criterio.data}'
        //     );
        //     `);
        //     const idComponenteCriterioDeAceptacion = criterioAceptacionRows[0][0].idComponenteCriterioDeAceptacion;
        //     console.log(`Se insertó el criterio de aceptacion: ${idComponenteCriterioDeAceptacion}`);
        // }
        // for (const entregable of entregables) {
        //     const [entregableRows] = await connection.query(`
        //     CALL INSERTAR_ENTREGABLE(
        //         '${entregable.data}',
        //         ${idComponenteEDT}
        //     );
        //     `);
        //     const idEntregable  = entregableRows[0][0].idEntregable;
        //     console.log(`Se insertó el entregable: ${idEntregable}`);
        // }
        res.status(200).json({
            idComponenteEDT,
            message: "Componente EDT modificado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el update del componente:", error);
        res.status(500).send("Error en el update del componente: " + error.message);
    }
}

async function eliminarComponenteEDT(req,res,next){
    console.log("Eliminando un ComponenteEDT...");
    //Insertar query aca
    const {idComponente, codigo} = req.body;
    console.log("Llegue a recibir solicitud eliminar componente edt");
    const query = `CALL ELIMINAR_COMPONENTE_EDT(?,?);`;
    try {
        await connection.query(query,[idComponente,codigo]);
        console.log(`Se elimino el componente EDT ${codigo}!`);
        res.status(200).json({
            message: "Componente EDT eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error en la eliminacion del componente EDT:", error);
        res.status(500).send("Error en la eliminacion del componente EDT: " + error.message);
    }
}

async function verInfoComponenteEDT(req,res,next){
    console.log("Llegue a recibir solicitud ver info de  Componente EDT");
    const {idComponente} = req.body;
    console.log("EL ID DEL COMPONENTE ES = " + idComponente);
    
    try {
        let query = "CALL LISTAR_COMPONENTE_EDT(?);";
        const [results] = await connection.query(query,[idComponente]);
        console.log(results[0]);

        query = "CALL LISTAR_CRITERIO_X_IDCOMPONENTE(?);";
        const [criterioAceptacion] = await connection.query(query,[idComponente]);

        query = "CALL LISTAR_ENTREGABLE_X_IDCOMPONENTE(?);";
        const [entregables] = await connection.query(query,[idComponente]);

        const componenteEDT = {
            component: results[0][0],
            criteriosAceptacion: criterioAceptacion[0],
            entregables: entregables[0]
        };
        res.status(200).json({
            componenteEDT,
            message: "Componente EDT obtenido exitosamente"
        });
        console.log('Si se listo Componente EDT');
    } catch (error) {
        console.error("Error al obtener info de  Componente EDT:", error);
        res.status(500).send("Error al obtener info de Componente EDT: " + error.message);
    }
}

async function eliminar(idEDT) {
    //const { idEDT } = req.body;
    console.log(`Procediendo: Eliminar/EDT ${idEDT}...`);
    try {
        const result = await funcEliminar(idEDT);
        // res.status(200).json({
        //     message: "EDT eliminado"});
        console.log(`EDT ${idEDT} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/EDT", error);
    }
}

async function funcEliminar(idEDT) {
    try {
        const query = `CALL ELIMINAR_EDT_X_ID_EDT(?);`;
        [results] = await connection.query(query,[idEDT]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/EDT", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/EDT del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`EDT del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/EDT X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_EDT_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/EDT X Proyecto", error);
        return 0;
    }
    return 1;
}

async function descargarExcel(req,res,next){
    const {componentes} = req.body;

    try{
        const workbook = await generarExcel(componentes,`EDT`);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `Tareas.xlsx`);
        
        // Enviar el archivo
        await workbook.xlsx.write(res);
        console.log("Se ha enviado el archivo excel EDT");
        res.end();
    }catch(error){
        next(error);
    }
}

async function generarExcel(componentes, nombreArchivo) {
    try{
        const workbook = new ExcelJS.Workbook();
        const WSComponentes = workbook.addWorksheet('Componentes');
        let filaActual = 1;

        const header1 = ["EDT"];
        filaActual = await excelJSController.agregaHeader(WSComponentes, filaActual, header1,headerTitulo,borderStyle);
        WSComponentes.mergeCells(filaActual-1, 1, filaActual-1, 8);
        const mergedCell = WSComponentes.getCell(filaActual-1, 1);
        mergedCell.style = {
            ...mergedCell.style, // Mantén los estilos previos
            alignment: alignmentCenterStyle
        };
        filaActual++;
        //Para revisar el excel creado durante la etapa de desarrollo, luego se debe borrar
        const destinationFolder = path.join(__dirname, '../../tmp');
        const excelFilePath = path.join(destinationFolder, `${nombreArchivo}.xlsx`);

        let nroComponente = 1;
        for(const componente of componentes){
            filaActual= await agregarComponenteAExcel(filaActual,WSComponentes, componente, `${nroComponente}`);
            nroComponente++;   
        }

        excelJSController.ajustarAnchoColumnas(WSComponentes);
        await workbook.xlsx.writeFile(excelFilePath);
        return workbook;
    }catch(error){
        console.log(error);
    }
}

async function agregarComponenteAExcel(filaActual, WSComponentes, componente, cadenaNroComponente){
    const header1 = ["Codigo","Nombre","Descripcion","Fecha Inicio","Fecha Fin","Recursos","Hito Asociado","Observaciones"];
    filaActual = await excelJSController.agregaHeader(WSComponentes, filaActual, header1,headerTitulo,borderStyle);

    try {
        let nroComponente = 1;
        componente.fechaInicio = dateController.formatearFecha2D_MM_YYYY(componente.fechaInicio);
        componente.fechaFin = dateController.formatearFecha2D_MM_YYYY(componente.fechaFin);
        
        WSComponentes.getRow(filaActual).values = [cadenaNroComponente,componente.nombre,componente.descripcion,componente.fechaInicio,componente.fechaFin,componente.recursos,componente.hito,componente.observaciones];
        filaActual+=2;
        
        if(componente.entregables){
            filaActual = await agregarEntregablesAExcel(filaActual,WSComponentes,componente.entregables);
            filaActual++;
        }
        if(componente.criterios){
            
            filaActual = await agregarCriterios(filaActual,WSComponentes,componente.criterios);
            filaActual++;
        }

        if(componente.componentesHijos){
            for(const componenteHijo of componente.componentesHijos){
                filaActual = await agregarComponenteAExcel(filaActual,WSComponentes,componenteHijo,`${cadenaNroComponente}.${nroComponente}`);
                nroComponente++;
            }
        }
        
    } catch (error) {
        console.log(error);
    }
    return filaActual;
}

async function agregarEntregablesAExcel(filaActual,WSComponentes,entregables){
    try {
        const header1 = ["Entregables"];
        const header2 = ["Codigo","Descripcion"];
        filaActual = await excelJSController.agregaHeader(WSComponentes, filaActual, header1,headerTitulo,borderStyle);
        filaActual = await excelJSController.agregaHeader(WSComponentes, filaActual, header2,headerTitulo,borderStyle);
        let nroEntregable = 1;
        for(const entregable of entregables){
            WSComponentes.getRow(filaActual).values = [nroEntregable,entregable.nombre];
            filaActual++;
            nroEntregable++;
        }
    } catch (error) {
        console.log(error);
    }
    return filaActual;
}

async function agregarCriterios(filaActual,WSComponentes,criterios){
    try{
        const header1 = ["Criterios de Aceptacion"];
        const header2 = ["Codigo","Descripcion"];
        filaActual = await excelJSController.agregaHeader(WSComponentes, filaActual, header1,headerTitulo,borderStyle);
        filaActual = await excelJSController.agregaHeader(WSComponentes, filaActual, header2,headerTitulo,borderStyle);
        let nroCriterio = 1;
        for(const criterio of criterios){
            WSComponentes.getRow(filaActual).values = [nroCriterio,criterio.descripcion];
            filaActual++;
            nroCriterio++;
        }
    }catch(error){
        console.log(error);
    }
    return filaActual;
}

module.exports = {
    listarComponentesEDT,
    listarEDT_X_IdProyecto,
    listarComponentesEDT_X_IdProyecto,
    insertarComponenteEDT,
    modificarComponenteEDT,
    eliminarComponenteEDT,
    verInfoComponenteEDT,
    eliminar,
    eliminarXProyecto,
    descargarExcel
}