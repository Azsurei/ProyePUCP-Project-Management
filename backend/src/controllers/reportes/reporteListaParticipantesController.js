
async function crearExcel(req,res,next){
    try {
        const {participantes} = req.body;
        const workbook = await generarExcel(participantes,`Lista de participantes`);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `Tareas.xlsx`);
        
        // Enviar el archivo
        await workbook.xlsx.write(res);
        console.log("Se ha enviado el archivo excel EDT");
        res.end();
    } catch (error) {
        next(error);
    }
}



async function generarExcel(listaParcipantes, nombreArchivo) {
    try{
        const workbook = new ExcelJS.Workbook();
        const WSParticipantes = workbook.addWorksheet('Lista de parcipantes');
        let filaActual = 1;
        for(const participante of listaParcipantes){
            filaActual = await agregarParticipanteAExcel(participante, WSParticipantes, filaActual);
        }
        const destinationFolder = path.join(__dirname, '../../tmp');
        const excelFilePath = path.join(destinationFolder, `${nombreArchivo}.xlsx`);

        excelJSController.ajustarAnchoColumnas(WSComponentes);
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

