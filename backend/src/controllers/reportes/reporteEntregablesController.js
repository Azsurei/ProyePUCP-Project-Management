const connection = require("../../config/db");
const XLSX = require('xlsx');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
const fs = require('fs');
const fsp = require('fs').promises
const path = require('path');
const excelJSController = require("../xlxs/excelJSController");

const headerTitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD8D8D8' } // Usa un color en formato ARGB
    }
};

const headerSubtitulo = {
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




async function traerInfoReporteEntregables(req, res, next) {
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


async function descargarExcel(req, res, next) {
    const {fileId} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        console.log(tmpFilePath);

        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const excelFilePath = path.join(destinationFolder, `${fileId}.xlsx`);

        console.log(jsonData);
        workbook = await generarExcelEntregables(jsonData);

        await workbook.xlsx.writeFile(excelFilePath);

        res.download(excelFilePath, `${fileId}.xlxs`, async(err) => {
            try {
                // Eliminar el archivo temporal de forma asíncrona
                //await fsp.unlink(tmpFilePath);
            } catch (e) {
                console.error("Error al eliminar el archivo temporal:", e.message);
            }
            if (err) {
                next(err);
            }
        });
    }catch(error){
        console.error("Error al exportar el reporte Excel:", error.message);
        next(error);
    } 
}
async function subirJSON(req, res, next) {
    const { entregables,idProyecto,nombre} = req.body;
    //console.log(req.body);


    try {
        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,2,nombre]);
        const idReporte = results[0][0].idReporte;
        //workbook = generarExcelEntregables(entregables);
        
        var tmpFilePath = generarPathEntregables(entregables,idReporte);

        const authClient = await authGoogle.authorize();
        const fileMetadata = {
            name: `Reporte-Entregables-${idReporte}.json`,
            parents:['1sMwcqO-22Kga2KH0rduVbG4WN5If9X4C']
        }

        const media = {
            mimeType: 'application/json',
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

async function obtenerJSON(req, res, next) {
    const {fileId} = req.params;
    const destinationFolder = path.join(__dirname, '../../tmp');
    console.log(destinationFolder);
    try{
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        console.log(tmpFilePath);

        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log(jsonData);
        res.status(200).json({
            jsonData,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    }   
}

function generarPathEntregables(presupuesto,idReporte){
    var tmpFilePath;
    try {
        tmpFilePath = `./tmp/entregables-${idReporte}.json`;
        console.log("Path nuevo "+tmpFilePath);
        fs.writeFileSync(tmpFilePath, JSON.stringify(presupuesto));
    } catch (error) {
        console.log(error);
    }
    return tmpFilePath;
}

async function generarExcelEntregables(entregables) {
    try {
        
        const workbook = new Exceljs.Workbook();

        let filaActual=1;
        
        for(const entregable of entregables){
            const WSEntregable = workbook.addWorksheet(`Entregable ${filaActual}`);
            filaActual++;
            await agregarEntregableAExcel(entregable,WSEntregable,filaActual);
            excelJSController.ajustarAnchoColumnas(WSEntregable);
        }
        // Escribe el libro de trabajo a un archivo



        console.log("Se generó el reporte de entregables con éxito");
    } catch (error) {
        console.log(error);
    }
}

async function agregarEntregableAExcel(entregable,WSEntregable,filaActual){
    try{
        await agregarCabecerasAExcelEntregable(entregable,WSEntregable,filaActual);
        await agregarContribuyentesAExcel(entregable.contribuyentes,WSEntregable,filaActual);
        await agregarTareasAExcel(entregable.tareasEntregable,WSEntregable,filaActual);
        
    }catch(error){
        console.log(error);
    }
}

async function agregarCabecerasAExcelEntregable(entregable,WSEntregable,filaActual){
    const header1 = ["Nombre","Fecha Inicio","Fecha Fin"];
    const header2 = ["Descripcion","ComponenteEDT","Hito asociado"];
    const header3 = ["Progreso"];
}

async function agregarContribuyentesAExcel(contribuyentes,WSEntregable,filaActual){

}

async function agregarTareasAExcel(tareasEntregable,WSEntregable,filaActual){

}

module.exports = {
    subirJSON,
    descargarExcel,
    obtenerJSON,
    traerInfoReporteEntregables
};
