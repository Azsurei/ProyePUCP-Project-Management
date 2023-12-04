async function formatearFecha2D_MM_YYYY(fecha) {
    const d = new Date(fecha);
    let dia = d.getDate().toString();
    let mes = (d.getMonth() + 1).toString(); // Los meses en JavaScript comienzan en 0
    let anio = d.getFullYear().toString(); // Obtener los últimos dos dígitos del año

    // Asegurarse de que el día y el mes tengan dos dígitos
    dia = dia.padStart(2, '0');
    mes = mes.padStart(2, '0');

    return `${dia}-${mes}-${anio}`;
}

module.exports = {
    formatearFecha2D_MM_YYYY
}