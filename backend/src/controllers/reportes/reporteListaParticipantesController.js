
const ExcelJS = require('exceljs');
const path = require('path');
const excelJSController = require("../xlxs/excelJSController");

const headerTitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF6B26B' } // Usa un color en formato ARGB
    }
};

const headerSubtitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD8D8D8' } // Usa un color en formato ARGB
    }
};

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

async function crearExcel(req,res,next){
    try {
        const {participantes,nombreEquipo} = req.body;
        const workbook = await generarExcel(participantes,nombreEquipo,`Lista de participantes`);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `ListaParticipantes.xlsx`);
        
        // Enviar el archivo
        await workbook.xlsx.write(res);
        console.log("Se ha enviado el archivo excel de la lista de participantes");
        res.end();
    } catch (error) {
        next(error);
    }
}



async function generarExcel(listaParcipantes,nombreEquipo, nombreArchivo) {
    try{
        const workbook = new ExcelJS.Workbook();
        const WSParticipantes = workbook.addWorksheet('Lista de parcipantes');
        let filaActual = 1;
        const header1 = [`Equipo: ${nombreEquipo}`];
        filaActual = await excelJSController.agregaHeader(WSParticipantes,filaActual,header1,headerTitulo,borderStyle);
        //Juntar las celdas
        WSParticipantes.mergeCells(filaActual-1, 1, filaActual-1, 4);
        const mergedCell = WSParticipantes.getCell(filaActual, 1);
        mergedCell.style = {
            ...mergedCell.style, 
            alignment: alignmentCenterStyle
        };

        const header2 = [`Nombre`,`Apellidos`,`Correo electrónico`,`Rol`];
        filaActual = await excelJSController.agregaHeader(WSParticipantes,filaActual,header2,headerSubtitulo,borderStyle);

        for(const participante of listaParcipantes){
            filaActual = await agregarParticipanteAExcel(participante, WSParticipantes, filaActual);
        }
        const destinationFolder = path.join(__dirname, '../../tmp');
        const excelFilePath = path.join(destinationFolder, `${nombreArchivo}.xlsx`);

        excelJSController.ajustarAnchoColumnas(WSParticipantes);
        await workbook.xlsx.writeFile(excelFilePath);
        return workbook;
    }catch(error){
        console.log(error);
    }
}

async function agregarParticipanteAExcel(participante, WSParticipantes, filaActual){
    try {
        WSParticipantes.getRow(filaActual).values = [participante.nombres,participante.apellidos,participante.correoElectronico,participante.nombreRol];
        filaActual++;

    } catch (error) {
        console.log(error);
    }
    return filaActual;
}

module.exports = {
    crearExcel
}

