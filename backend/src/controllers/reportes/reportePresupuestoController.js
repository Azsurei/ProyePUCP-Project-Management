const connection = require("../../config/db");
const XLSX = require('xlsx');


const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
//import multer from "multer";

//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

async function generarReporte(req, res, next) {
    const {presupuesto} = req.body;
    res.status(200);
    try {
        let excelReport = await probandoExcelPresupuesto(presupuesto);
        const authClient = await authGoogle.authorize();

        const fileMetadata = {
            name:"prueba.xlsx",
            parents:['1xPZCsesZHk5kQy08fKt1-MnPbo9mnUmd']
        }

        const media = {
            body: fs.createReadStream("prueba.xlsx"),
            mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    
        const file = await authGoogle.uploadFile(authClient,fileMetadata,media);

        fs.unlinkSync("prueba.xlsx");
        
        res.status(200).json({
            presupuesto,
            message: "Se genero el reporte con exito",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function probandoExcelPresupuesto(presupuesto) {
    
    try {
        const {general,lineasPresupuesto} = presupuesto;
        
        const wb = XLSX.utils.book_new();
        
        // Encabezados personalizados
        const headerGeneral = [["Nombre del proyecto","Reporte de Herramienta","Presupuesto inicial","Fecha de creacion","MonedaPrincipal","Meses del proyecto"]];
        const headerIngreso = [["Nro Linea", "Descripcion", "Monto", "Cantidad", "Fecha Transaccion", "Moneda", "Tipo Transaccion", "Tipo Ingreso"]];
        const headerEgreso = [["Nro Linea", "Descripcion", "Costo Real", "Cantidad", "Fecha Registro", "Moneda"]];
        const headerEstimacionCosto = [["Nro Linea", "Descripcion", "Tarifa Unitaria", "Cantidad Recurso","Subtotal", "Fecha Inicio", "Moneda", "Tiempo Requerido"]];

        const camposIngresos = ["idLineaIngreso","descripcion","monto","cantidad","fechaTransaccion","nombreMoneda","descripcionTransaccionTipo","descripcionIngresoTipo"];
        const camposEgresos = ["idLineaEgreso","descripcion","costoReal","cantidad","fechaRegistro","nombreMoneda"];
        const camposEstimacionCosto = ["idLineaEstimacion","descripcion","tarifaUnitaria","cantidadRecurso","subtotal","fechaInicio","nombreMoneda","tiempoRequerido"];
        const camposInfoGeneral = ["nombreProyecto","nombreHerramienta","presupuestoInicial","fechaCreacion","nombreMoneda","cantidadMeses"]
        
        const lineasIngresoReducidas = xlsxController.extraerCampos(lineasPresupuesto.lineasIngreso, camposIngresos);
        const lineasEgresoReducidas = xlsxController.extraerCampos(lineasPresupuesto.lineasEgreso, camposEgresos);
        const lineasEstimacionCostoReducidas = xlsxController.extraerCampos(lineasPresupuesto.lineasEstimacionCosto, camposEstimacionCosto);
        const infoGeneralReducida = xlsxController.extraerCampos(general,camposInfoGeneral);

        // Crear hojas y añadir encabezados
        xlsxController.agregarDatosAHoja(wb, headerGeneral, infoGeneralReducida, 'General');
        xlsxController.agregarDatosAHoja(wb, headerIngreso, lineasIngresoReducidas, 'Ingresos');
        xlsxController.agregarDatosAHoja(wb, headerEgreso, lineasEgresoReducidas, 'Egresos');
        xlsxController.agregarDatosAHoja(wb, headerEstimacionCosto, lineasEstimacionCostoReducidas, 'Estimaciones');
        
        // Guardar el archivo Excel
        XLSX.writeFile(wb, 'presupuesto.xlsx', { compression: true });

        authorize().then(uploadFile).catch("error", console.error());
        console.log(`Archivo Excel 'presupuesto.xlsx' guardado con éxito.`);
    } catch (error) {
        console.log(error); 
    }
}

function jsonToSheet(data) {
    const ws = XLSX.utils.json_to_sheet(data);
    return ws;
}

module.exports = {
    generarReporte
}