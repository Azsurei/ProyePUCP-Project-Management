const connection = require("../../config/db");
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function generarReportePresupuesto(req, res, next) {
    const {presupuesto} = req.body;
    try {
        let excelReport = await obtenerExcelPresupuesto(presupuesto);


        console.log("Reporte generado con exito ");

        res.status(200).json({
            reporte,
            message: "Se genero el reporte con exito",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


module.exports = {

}