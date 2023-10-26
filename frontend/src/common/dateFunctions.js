//  2023-10-25T05:00:00.000Z a 25/10/2023
export function dbDateToDisplayDate(dbDate) {
    const formattedDate = new Date(dbDate);
    return formattedDate.toLocaleDateString();
}

//  2023-10-25T05:00:00.000Z a 2023-10-25
export function dbDateToInputDate(dbDate) {
    const fecha = new Date(dbDate);

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    // Formatear la fecha en el formato deseado (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
}

// 6/10/2023 a 2023-10-06
export function displayDateToInputDate(displayDate) {
    const partesFecha = displayDate.split("/");

    // Crear una nueva fecha en el formato "mes/día/año"
    const fecha = new Date(
        `${partesFecha[1]}/${partesFecha[0]}/${partesFecha[2]}`
    );

    // Obtener los componentes (año, mes y día) de la nueva fecha
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    // Formatear la fecha en el formato deseado (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
}

// 2023-10-06 a 6/10/2023
export function inputDateToDisplayDate(inputDate) {
    const fecha = new Date(inputDate);

    const dia = fecha.getDate() + 1;
    const mes = fecha.getMonth() + 1; // Nota: El mes se indexa desde 0, por lo que se suma 1.
    const año = fecha.getFullYear();

    // Formatear la fecha en el formato deseado (D/M/YYYY)
    return `${dia}/${mes}/${año}`;
}
