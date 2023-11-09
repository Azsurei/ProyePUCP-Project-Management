const connection = require("../../config/db");
const XLSX = require('xlsx');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
const fs = require('fs');

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
    const { entregables } = req.body;
    //console.log(req.body);


    try {
        workbook = generarExcelEntregables(entregables);
        
        var tmpFilePath = generarPathEntregables(workbook,124565);
        console.log(`=============================================`);
        console.log(tmpFilePath);
        const authClient = await authGoogle.authorize();
        const fileMetadata = {
            name: `Reporte-Entregables-${Date.now()}.xlsx`,
            parents:['1xPZCsesZHk5kQy08fKt1-MnPbo9mnUmd']
        }

        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: fs.createReadStream(tmpFilePath)
        };

        const driverResponse = await authGoogle.uploadFile(authClient,fileMetadata,media);

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

function generarPathEntregables(workbook,idReporte){
    try {
        let tmpFilePath = `./tmp/entregables-${idReporte}.xlsx`;
        console.log("Path nuevo"+tmpFilePath);
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
            const headerGeneral = ["Nombre del proyecto","Reporte de Herramienta","Presupuesto inicial","Fecha de creacion","MonedaPrincipal","Meses del proyecto"];
            var descripcionGeneral = xlsxController.extraerCampos(entregable, ["nombre","ComponenteEDTNombre","descripcion","hito","fechaInicio","fechaFin"]);
            var filasHoja = [];
            filasHoja.push(headerGeneral);
            filasHoja.push(Object.values(descripcionGeneral[0])); // Aquí estaba el problema
            agregarInformacionEntregableAHoja(filasHoja,entregable.barProgress,entregable.contribuyentes);
            // Añade una fila vacía para separar la descripción general de las tareas
            filasHoja.push({});

            // Agrega los encabezados de las tareas y las tareas si existen
            if (entregable.tareasEntregable && entregable.tareasEntregable.length > 0) {
                // Encabezados de las tareas
                filasHoja.push({
                    idTarea: "ID Tarea",
                    nombre: "Nombre",
                    descripcion: "Descripción",
                    fechaInicio: "Fecha de Inicio",
                    fechaFin: "Fecha de Fin",
                    // ... otros campos de encabezados de las tareas
                });
                agregarTareasAHoja(filasHoja,entregable.tareasEntregable);
                // Tareas individuales
                //filasHoja = filasHoja.concat(Object.values(entregable.tareasEntregable));
            }

            // Convierte el array de filas en una hoja de trabajo de Excel
            var wsGeneral = XLSX.utils.json_to_sheet(filasHoja, { skipHeader: true });

            // Agrega la hoja al libro
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

function agregarInformacionEntregableAHoja(filasHoja,barProgress,contribuyentes){
    filasHoja.push({
        barProgress: "Progreso",
        progreso: barProgress
    });
    

    filasHoja.push({
        contribuyentes: "Contribuyentes",
    });
    
    contribuyentes.forEach((contribuyente, index) => {
        console.log(contribuyente);
        if(contribuyente.usuario!=null){
            filasHoja.push({
                nombres: "Nombres",
                apellidos: "Apellidos",
                correo: "Correo Electronico",
            });
        
            filasHoja.push({
                nombres: contribuyente.usuario.nombres,
                apellidos: contribuyente.usuario.apellidos,
                correo: contribuyente.usuario.correoElectronico,
            });
        }else if(contribuyente.equipo!=null){
            filasHoja.push({
                nombres: "Equipo"
            });
            filasHoja.push({
                nombres: contribuyente.equipo.nombre
            });

        }
        //Falta implementar equipo
    });
}
function agregarTareasAHoja(filasHoja,tareas){
    tareas.forEach((tarea, index) => {
        filasHoja.push({
            idTarea: index+1,
            nombre: tarea.nombre,
            descripcion: tarea.descripcion,
            fechaInicio: tarea.fechaInicio,
            fechaFin: tarea.fechaFin,
        });

        if(tarea.equipo!=null){
            filasHoja.push({
                idTarea: "Por implementar",
                nombre: "Nombre",
                descripcion: "Descripción",
                fechaInicio: "Fecha de Inicio",
                fechaFin: "Fecha de Fin",
            });
        }else if(tarea.usuarios!=null){
            filasHoja.push({
                nombres: "Nombres",
                apellidos: "Apellidos",
                correo: "Correo Electronico",
            });
            agregarUsuariosAHoja(filasHoja,tarea.usuarios);
        }
    });
}

function agregarUsuariosAHoja(filasHoja,usuarios){
    usuarios.forEach((usuario, index) => {
        filasHoja.push({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correoElectronico,
        });
    });
    console.log(`Llegue uwu`);
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
    generarReporte
};
