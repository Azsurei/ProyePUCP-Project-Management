const connection = require("../../config/db");
const XLSX = require('xlsx');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
const fs = require('fs');
const path = require('path');

async function generarReporteEntregables(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_ENTREGABLES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        const entregables = results[0];

        console.log("Entregables listados con exito ");

        const query2 = `CALL LISTAR_TAREAS_X_ID_ENTREGABLE(?);`;
        for (const entregable of entregables) {
            const [results2] = await connection.query(query2, [
                entregable.idEntregable,
            ]);
            const tareasEntregable = results2[0];

            for (const tarea of tareasEntregable) {
                if (tarea.idEquipo !== null) {

                    const query4 = `CALL LISTAR_EQUIPO_X_ID_EQUIPO(?);`;
                    const [equipo] = await connection.query(query4, [
                        tarea.idEquipo,
                    ]);
                    tarea.equipo = equipo[0][0]; //solo consideramos que una tarea es asignada a un subequipo

                    //listamos los participantes de dicho equipo
                    const query5 = `CALL LISTAR_PARTICIPANTES_X_IDEQUIPO(?);`;
                    const [participantes] = await connection.query(query5, [
                        tarea.idEquipo,
                    ]);
                    tarea.equipo.participantes = participantes[0];
                    tarea.usuarios = [];
                } else {

                    const query6 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
                    const [usuarios] = await connection.query(query6, [
                        tarea.idTarea,
                    ]);
                    if (usuarios != null) {
                        tarea.usuarios = usuarios[0];
                    }
                    tarea.equipo = null;
                    
                }
            }

            entregable.tareasEntregable = tareasEntregable;
        }

        res.status(200).json({
            entregables,
            message: "Se listaron los entregables con exito",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function generarReporte(req, res, next) {
    const { entregables,idProyecto,nombre} = req.body;
    //console.log(req.body);


    try {
        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,2,nombre]);
        const idReporte = results[0][0].idReporte;
        workbook = generarExcelEntregables(entregables);
        
        var tmpFilePath = generarPathEntregables(workbook,idReporte);

        const authClient = await authGoogle.authorize();
        const fileMetadata = {
            name: `Reporte-Entregables-${idReporte}.xlsx`,
            parents:['1sMwcqO-22Kga2KH0rduVbG4WN5If9X4C']
        }

        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: fs.createReadStream(tmpFilePath)
        };

        const driverResponse = await authGoogle.uploadFile(authClient,fileMetadata,media);
        console.log(driverResponse.data.id);
        
        const query2 = `CALL ACTUALIZAR_FILE_ID(?,?);`;
        const [results2] = await connection.query(query2, [idReporte,driverResponse.data.id]);

        fs.unlinkSync(tmpFilePath);
        res.status(200).json({
            entregables,
            fileId: driverResponse.data.id,
            message: "Se genero el reporte de entregables con exito",
        });
    } catch (error) {
        next(error);
    }
}

async function obtenerReporte(req, res, next) {
    const {fileId} = req.params;
    const destinationFolder = path.join(__dirname, '../../tmp');
    console.log(destinationFolder);
    try{
        const authClient = await authGoogle.authorize();
        const fileDetails = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        const reporteJSON = await convertirExcel2JSON(fileDetails);
        res.status(200).json({
            reporteJSON,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    }   
}

async function convertirExcel2JSON(filePath){
    const workbook = XLSX.readFile(filePath);
    let result = {};
    workbook.SheetNames.forEach(sheetName =>{
        const woorksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(woorksheet);
        result[sheetName] = json;
    });

    return result;
}


function generarPathEntregables(workbook,idReporte){
    var tmpFilePath;
    try {
        tmpFilePath = `./tmp/entregables-${idReporte}.xlsx`;
        console.log("Path nuevo "+tmpFilePath);
        XLSX.writeFile(workbook, tmpFilePath, { compression: true });
    } catch (error) {
        console.log(error);
    }
    return tmpFilePath;
}

function generarExcelEntregables(entregables) {
    try {
        
        const wb = XLSX.utils.book_new();

        entregables.forEach((entregable, index) => {
            // Inicializa un array para las filas de la hoja de trabajo
            

            // Añade la descripción general del entregable directamente como un objeto, no como un array de objetos
            var [descripcionGeneral] = xlsxController.extraerCampos(entregable, ["nombre","ComponenteEDTNombre","descripcion","hito","fechaInicio","fechaFin"]);
            var filasHoja = [];
            filasHoja.push({
                c1: "Nombre del proyecto",
                c2: "Reporte de Herramienta",
                c3: "Presupuesto inicial",
                c4: "Fecha de creacion",
                c5: "MonedaPrincipal",
                c6: "Meses del proyecto",
            });
            console.log(descripcionGeneral);
            filasHoja.push({
                c1: descripcionGeneral.nombre,
                c2: descripcionGeneral.ComponenteEDTNombre,
                c3: descripcionGeneral.descripcion,
                c4: descripcionGeneral.hito,
                c5: descripcionGeneral.fechaInicio,
                c6: descripcionGeneral.fechaFin,
                
            });
            agregarInformacionEntregableAHoja(filasHoja,entregable.barProgress,entregable.contribuyentes);
            // Añade una fila vacía para separar la descripción general de las tareas
            // Agrega los encabezados de las tareas y las tareas si existen
            if (entregable.tareasEntregable && entregable.tareasEntregable.length > 0) {
                // Encabezados de las tareas
                filasHoja.push({
                    c1: "ID Tarea",
                    c2: "Nombre",
                    c3: "Descripción",
                    c4: "Fecha de Inicio",
                    c5: "Fecha de Fin",
                    // ... otros campos de encabezados de las tareas
                });
                agregarTareasAHoja(filasHoja,entregable.tareasEntregable);

                // Tareas individuales
                //filasHoja = filasHoja.concat(Object.values(entregable.tareasEntregable));
            }

            // Convierte el array de filas en una hoja de trabajo de Excel
            var wsGeneral = XLSX.utils.json_to_sheet(filasHoja, { skipHeader: true });
            xlsxController.ajustarAnchoDeColumna(wsGeneral, filasHoja);
            // Agrega la hoja al libro
            //xlsxController.ajustarRangoDeHoja(wsGeneral);
            XLSX.utils.book_append_sheet(wb, wsGeneral, `Entregable ${index + 1}`);
        });
        return wb;
        // Escribe el libro de trabajo a un archivo
        XLSX.writeFile(wb, 'entregables.xlsx', { compression: true });
        console.log("Se generó el reporte de entregables con éxito");
    } catch (error) {
        console.log(error);
    }
}

function verificarFilasHoja(filasHoja) {
    for (let i = 0; i < filasHoja.length; i++) {
        let fila = filasHoja[i];
        if (Array.isArray(fila)) {
            // Verifica si el primer elemento de la fila (arreglo) está vacío
            if (fila.length === 0 || fila[0] === undefined || fila[0] === '') {
                console.error('La fila ' + i + ' comienza con una celda vacía:', fila);
            }
        } else if (typeof fila === 'object') {
            // Verifica si la primera propiedad del objeto está vacía
            let primerValor = fila[Object.keys(fila)[0]];
            if (primerValor === undefined || primerValor === '') {
                console.error('La fila ' + i + ' comienza con una celda vacía:', fila);
            }
        }
    }
}

function agregarInformacionEntregableAHoja(filasHoja,barProgress,contribuyentes){
    // Primero agrega el progreso en su propia fila
    filasHoja.push({
        c1: "Progreso",
        c2: barProgress
    });
    
    filasHoja.push({
        c1: "Contribuyentes"
    });
    
    contribuyentes.forEach((contribuyente, index) => {
        //console.log(contribuyente);
        if(contribuyente!=null){
            if(contribuyente.usuario!=null){
                filasHoja.push({
                    c1: "Nombres",
                    c2: "Apellidos",
                    c3: "Correo Electronico",
                });
            
                filasHoja.push({
                    c1: contribuyente.usuario.nombres,
                    c2: contribuyente.usuario.apellidos,
                    c3: contribuyente.usuario.correoElectronico,
                });
            }else if(contribuyente.equipo!=null){
                filasHoja.push({
                    c1: "Equipo"
                });
                filasHoja.push({
                    c1: contribuyente.equipo.nombre
                });
    
            }
            //Falta implementar equipo
        }
    });
}
function agregarTareasAHoja(filasHoja,tareas){
    tareas.forEach((tarea, index) => {
        filasHoja.push({
            c1: index+1,
            c2: tarea.nombre,
            c3: tarea.descripcion,
            c4: tarea.fechaInicio,
            c5: tarea.fechaFin,
        });

        if(tarea.equipo!=null){
            filasHoja.push({
                c1: "Por implementar",
                c2: "Nombre",
                c3: "Descripción",
                c4: "Fecha de Inicio",
                c5: "Fecha de Fin",
            });
        }else if(tarea.usuarios!=null){
            filasHoja.push({
                c1: "Nombres",
                c2: "Apellidos",
                c3: "Correo Electronico",
            });
            agregarUsuariosAHoja(filasHoja,tarea.usuarios);
        }
    });
}

function agregarUsuariosAHoja(filasHoja,usuarios){
    usuarios.forEach((usuario, index) => {
        filasHoja.push({
            c1: usuario.nombres,
            c2: usuario.apellidos,
            c3: usuario.correoElectronico,
        });
    });
}

function prueba(entregables) {
    try {
        
        const wb = XLSX.utils.book_new();

        entregables.forEach((entregable, index) => {



            XLSX.utils.book_append_sheet(wb, wsGeneral, `Entregable ${index + 1}`);
        });

        // Escribe el libro de trabajo a un archivo
        XLSX.writeFile(wb, 'entregables.xlsx', { compression: true });
        console.log("Se generó el reporte de entregables con éxito");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    generarReporte,
    obtenerReporte
};
